const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const userCtrl = require("../controllers/user");
const postCtrl = require("../controllers/post");
const multer = require("../middleware/multer-config");

router.get("/:id/posts", auth, postCtrl.getPostByUser);
router.delete("/:id", auth, userCtrl.deleteUser);
router.put("/:id", auth, multer, userCtrl.modifyUser);
router.get("/:id", auth, userCtrl.getOneUser);
router.get("/", auth, userCtrl.getAllUsers);

module.exports = router;
