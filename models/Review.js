const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ReviewSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Please, enter text"],
    },
    text: {
      type: String,
      required: [true, "Please, enter text"],
    },
    userId: { type: ObjectId, ref: "User" },
    productId: { type: ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;