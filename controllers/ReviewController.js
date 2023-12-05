const Review = require("../models/Review");
const Post = require("../models/Post");
const User = require("../models/User");

const ReviewController = {
  async create(req, res, next) {
    try {
      const review = await Review.create({
        ...req.body,
        userId: req.user._id,
      });

      await Post.findByIdAndUpdate(
        req.params._id,
        { $push: { reviewIds: review._id } },
        { new: true }
      );
      res.status(201).send(review);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
 
};

module.exports = ReviewController;
