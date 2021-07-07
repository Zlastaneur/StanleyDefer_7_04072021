const post = require("../models/post");
const fs = require("fs");

exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.post);
    delete postObject._id; // ?
    const post = new Post({
        ...postObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    post.save()
        .then(() => res.status(201).json({ message: "Object saved !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.modifyPost = (req, res, next) => {
    const postObject = req.file
        ? {
              ...JSON.parse(req.body.post),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          }
        : { ...req.body };
    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Object modified !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            const filename = post.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Post.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Object deleted !" }))
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.getOnePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => res.status(200).json(post))
        .catch((error) => res.status.apply(400).json({ error }));
};

exports.getAllPosts = (req, res, next) => {
    Post.find()
        .then((posts) => res.status(200).json(posts))
        .catch((error) => res.status(400).json({ error }));
};

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
};
