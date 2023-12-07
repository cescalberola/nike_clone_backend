const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ProductSchema = new mongoose.Schema(
  {
    image: [
      {
        type: String,
      },
    ],
    title: {
      type: String,
      required: [true, "Please, enter a title"],
    },
    description: {
      type: String,
      required: [true, "Please, enter description"],
    },
    gender: {
      type: String,
      required: [true, "Please, enter sex"],
    },
    color: {
      type: String,
      required: [true, "Please, enter color"],
    },
    size: { type: String, required: [true, "Please, enter size"] },
    rating: { type: Number },
    likes: [{ type: ObjectId, ref: "User" }],
    userId: { type: ObjectId, ref: "User" },
    reviewIds: [{ type: ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
