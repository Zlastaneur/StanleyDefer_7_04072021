const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const postCtrl = require("../controllers/post");
const commentCtrl = require("../controllers/comment");

router.post("/", auth, postCtrl.createPost);
router.put("/:id", auth, postCtrl.modifyPost);
router.delete("/:id", auth, postCtrl.deletePost);
router.get("/:id", auth, postCtrl.getOnePost);
router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id/comments", commentCtrl.getAllComments);

module.exports = router;
