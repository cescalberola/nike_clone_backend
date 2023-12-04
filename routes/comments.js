const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const {
  authentication,
  isAdmin,
  isSuperAdmin,
  isCommentAuthor,
} = require("../middleware/authentication");
// const upload = require("../middleware/upload");

router.post(
  "/:_id",
  authentication,
  // upload.single("image"),
  CommentController.create
);
router.delete(
  "/:_id",
  authentication,
  isCommentAuthor,
  CommentController.delete
);
router.put("/like/:_id", authentication, CommentController.like);
router.put("/unlike/:_id", authentication, CommentController.unlike);

module.exports = router;
