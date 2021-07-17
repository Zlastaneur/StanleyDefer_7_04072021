const models = require("../models");
const Comment = models.comments;

exports.createComment = (req, res, next) => {
    const commentObject = req.body;
    const comment = new comment({
        ...commentObject,
    });
    comment
        .save()
        .then(() => {
            Comment.findAll({
                where: { postId: req.body.postId },
            }).then((comments) => {
                res.status(200).json(comments);
            });
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteComment = (req, res, next) => {
    Comment.destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "Comment deleted !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.getAllComments = (req, res, next) => {
    Comment.findAll({ where: { postId: req.params.id } })
        .then((comments) => res.status(200).json(comments))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneComment = (req, res, next) => {
    Comment.findOne({ where: { id: req.params.id } })
        .then((comment) => res.status(200).json(comment))
        .catch((error) => res.status(400).json({ error }));
};
