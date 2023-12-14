const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authentication, isAdmin, isSuperAdmin, } = require("../middleware/authentication");

router.post("/check-email", UserController.checkEmail);
router.post("/register", UserController.create);
router.post("/login", UserController.login);
router.get("/confirm/:emailToken", UserController.confirm);
router.get("/profile", authentication, UserController.getLoggedUser);
router.put("/profile", authentication, UserController.updateProfile);
router.get("/:_id", UserController.getById);
router.delete("/logout", authentication, UserController.logout);

module.exports = router;
