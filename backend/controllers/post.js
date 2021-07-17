const models = require("../models");
const Post = models.posts;
const jwt = require("jsonwebtoken");

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decodedToken.userId;

    if (title === null || title === "" || content === null || content === "") {
        return res.status(400).json({ error: "Missing title or content" });
    }

    const postObject = req.body;
    const post = new Post({
        ...postObject,
        userId,
    });
    post.save()
        .then(() => res.status(201).json({ message: "Post created !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.modifyPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    if (title === null || title === "" || content === null || content === "") {
        return res.status(400).json({ error: "Missing title or content" });
    }

    const postObject = req.body;

    Post.update(
        {
            ...postObject,
            id: req.params.id,
        },
        { where: { id: req.params.id } }
    )
        .then(() => res.status(201).json({ message: "Post modified !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
    Post.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "Post deleted !" }))
        .catch((error) => res.status(500).json({ error }));
};

exports.getAllPosts = (req, res, next) => {
    Post.findAll({ order: [["createdAt", "DESC"]] })
        .then((posts) => res.status(200).json(posts))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOnePost = (req, res, next) => {
    Post.findOne({ where: { id: req.params.id } })
        .then((post) => res.status(200).json(post))
        .catch((error) => res.status(400).json({ error }));
};

exports.getPostByUser = (req, res, next) => {
    Post.findAll({
        where: { userId: req.params.id },
        order: [["createdAt", "DESC"]],
    })
        .then((posts) => res.status(200).json(posts))
        .catch((error) => res.status(400).json({ error }));
};
/*
exports.likePost = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;

    Post.findOne({ _id: req.params.id })
        .then((post) => {
            const isLiked = post.usersLiked.includes(userId);
            const isDisliked = post.usersDisliked.includes(userId);
            const likedOrDisliked = isLiked || isDisliked;

            if (!likedOrDisliked) {
                let message = "";
                let update = {};

                if (like === 1) {
                    message = "Liked";
                    update = { $push: { usersLiked: userId }, $inc: { likes: +1 } };
                } else if (like === -1) {
                    message = "Disliked";
                    update = { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } };
                }
                return Post.updateOne({ _id: req.params.id }, update)
                    .then(() => res.status(200).json({ message }))
                    .catch((error) => res.status(500).json({ error }));
            }

            if (likedOrDisliked) {
                let message = "";
                let update = {};
                if (isLiked) {
                    message = "Like Canceled";
                    update = { $pull: { usersLiked: userId }, $inc: { likes: -1 } };
                } else if (isDisliked) {
                    message = "Dislike Canceled";
                    update = { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } };
                }
                return Post.updateOne({ _id: req.params.id }, update)
                    .then(() => res.status(200).json({ message }))
                    .catch((error) => res.status(500).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};*/
