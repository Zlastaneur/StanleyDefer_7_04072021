const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, `${process.env.JWT_TOKEN}`);
        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin;
        if (req.body.userId && req.body.userId !== userId) {
            throw "User ID unavailable";
        } else if (req.body.isAdmin && req.body.isAdmin !== isAdmin) {
            throw "User role unavailable";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: new Error("invalid request") });
    }
};
