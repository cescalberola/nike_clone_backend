const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {
  authentication,
  isAdmin,
  isSuperAdmin,
} = require("../middleware/authentication");
const upload = require("../middleware/upload");

router.post("/register", upload.single("avatar"), UserController.create);
router.post("/login", UserController.login);
router.get("/confirm/:emailToken", UserController.confirm);
router.get("/profile", authentication, UserController.getLoggedUser);
router.put(
  "/profile",
  authentication,
  upload.single("avatar"),
  UserController.updateProfile
);
router.get("/:_id", UserController.getById);
router.get("/name/:username", UserController.getByName);
router.put("/follow/:_id/", authentication, UserController.follow);
router.put("/unfollow/:_id/", authentication, UserController.unFollow);
router.delete("/logout", authentication, UserController.logout);

module.exports = router;
