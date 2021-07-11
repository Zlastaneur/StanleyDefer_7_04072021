const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const models = require("../models");
const User = models.users;

require("dotenv").config();

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    if (
        email === null ||
        email === "" ||
        password === null ||
        password === "" ||
        firstname === null ||
        firstname === "" ||
        lastname === null ||
        lastname === ""
    ) {
        return res.status(400).json({ error: "Missing fields" });
    }

    User.findOne({
        where: { email: email },
    })
        .then((userFound) => {
            if (!userFound) {
                bcrypt.hash(password, 10).then((hash) => {
                    const user = new User({
                        email: email,
                        password: hash,
                        firstname: firstname,
                        lastname: lastname,
                    });
                    user.save()
                        .then(() => res.status(201).json({ message: "User created" }))
                        .catch((error) => res.status(400).json({ error }));
                });
            } else {
                return res.status(409).json({ error: "User already existing" });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ where: { email: req.body.email } })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: "can't find user" });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ error: "wrong password" });
                    }
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, `${process.env.JWT_TOKEN}`, {
                            expiresIn: "2h",
                        }),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
