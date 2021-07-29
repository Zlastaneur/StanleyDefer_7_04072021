const models = require("../models");
const User = models.users;
const Post = models.posts;
const Comment = models.comments;
const fs = require("fs");

exports.deleteUser = (req, res, next) => {
    Comment.destroy({ where: { userId: req.params.id } })
        .then(() =>
            Post.findAll({ where: { userId: req.params.id } })
                .then((posts) => {
                    posts.forEach((post) => {
                        Comment.destroy({ where: { postId: post.id } });
                        Post.destroy({ where: { id: post.id } });
                    });
                })
                .then(() =>
                    User.findOne({ where: { id: req.params.id } }).then((user) => {
                        const filename = user.imageUrl;
                        fs.unlink(`images/${filename}`, () => {
                            User.destroy({ where: { id: req.params.id } }).then(() =>
                                res.status(200).json({ message: "User deleted" })
                            );
                        });
                    })
                )
        )
        .catch((error) => res.status(400).json({ error }));
};

exports.modifyUser = (req, res, next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    if (firstname === null || firstname === "" || lastname === null || lastname === "") {
        return res.status(400).json({ error: "Missing fields" });
    }

    const userObject = req.file
        ? {
              ...req.body.user,
              imageUrl: req.file.filename,
          }
        : { ...req.body };
    User.update({ ...userObject, id: req.params.id }, { where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "User modified !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneUser = (req, res, next) => {
    User.findOne({ where: { id: req.params.id } })
        .then((user) => res.status(200).json(user))
        .catch((error) => res.status.apply(400).json({ error }));
};
exports.getAllUsers = (req, res, next) => {
    User.findAll()
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status.apply(400).json({ error }));
};
