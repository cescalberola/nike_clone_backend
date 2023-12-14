const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");

const ReviewController = {
  async create(req, res, next) {
    try {
      if (!req.body.productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const review = await Review.create({
        ...req.body,
        userId: req.user._id,
      });

      await Product.findByIdAndUpdate(
        req.body.productId,
        { $push: { reviewIds: review._id } },
        { new: true }
      );

      res.status(201).send(review);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async delete(req, res) {
    try {
      await Review.findByIdAndDelete(req.params._id);
      res.status(200).send({ message: "Review deleted succesfully." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error trying to remove the review" });
    }
  },

  async like(req, res) {
    try {
      const loggedUser = await User.findById(req.user._id);
      let reviewToLike = await Review.findById(req.params._id);

      if (!reviewToLike)
        return res.status(400).send({ message: "Review not found" });

      if (reviewToLike.likes.includes(req.user._id)) {
        return res.status(400).send({
          message: `You already liked this review by ${reviewToLike.userId}, review ${loggedUser.firstName}`,
        });
      } else {
        reviewToLike = await Review.findByIdAndUpdate(
          req.params._id,
          { $push: { likes: req.user._id } },
          { new: true }
        );

        await User.findByIdAndUpdate(
          req.user._id,
          { $push: { likesList: req.params._id } },
          { new: true }
        );

        res.send(reviewToLike);
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "There was a problem liking the review" });
    }
  },

  async unlike(req, res) {
    try {
      let reviewToUnlike = await Review.findById(req.params._id);

      if (!reviewToUnlike)
        return res.status(400).send({ message: "Review not found" });

      reviewToUnlike = await Review.findByIdAndUpdate(
        req.params._id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { likesList: req.params._id } },
        { new: true }
      );

      res.send(reviewToUnlike);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "There was a problem unliking the review" });
    }
  },
};

module.exports = ReviewController;
