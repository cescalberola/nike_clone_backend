const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please, enter title"],
    },
    message: {
      type: String,
      required: [true, "Please, enter message"],
    },
    rate: {
      type: Number,
      required: [true, "Please, enter your rate"],
    },
    userId: { type: ObjectId, ref: "User" },
    postId: { type: ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
