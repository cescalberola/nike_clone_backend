const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const {authentication,isAdmin,isSuperAdmin,isCommentAuthor} = require("../middleware/authentication");
// const upload = require("../middleware/upload");

router.post("/:_id",authentication,ReviewController.create);



module.exports = router;
