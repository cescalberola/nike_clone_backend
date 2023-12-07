const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please, enter title"],
    },
    text: {
      type: String,
      maxlength: [255, "Review text must be maximum 255 characters"],
      required: [true, "Please, enter text"],
    },
    userId: { type: ObjectId, ref: "User" },
    productId: { type: ObjectId, ref: "Product" },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must not exceed 5"],
      required: [true, "Please, enter a rating"],
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
