const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const {
  authentication,
  isAdmin,
  isSuperAdmin,
  isReviewAuthor,
} = require("../middleware/authentication");
// const upload = require("../middleware/upload");

router.post(
  "/:_id",
  authentication,
  // upload.single("image"),
  ReviewController.create
);
router.delete(
  "/:_id",
  authentication,
  isReviewAuthor,
  ReviewController.delete
);
router.put("/like/:_id", authentication, ReviewController.like);
router.put("/unlike/:_id", authentication, ReviewController.unlike);

module.exports = router;
