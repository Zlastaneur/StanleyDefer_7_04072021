/*const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const userCtrl = require("../controllers/user");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, userCtrl.createUser);
router.put("/:id", auth, multer, userCtrl.modifyUser);
router.delete("/:id", auth, userCtrl.deleteUser);
router.get("/:id", auth, userCtrl.getOneUser);
router.get("/", auth, userCtrl.getAllUsers);
router.post("/:id/like", auth, userCtrl.likeUser);

module.exports = router;
*/
