const express = require("express");
const path = require("path");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

require("dotenv").config();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use(express.json());

const db = require("./models");
db.sequelize.sync();

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(helmet());
app.use(rateLimit());

module.exports = app;
