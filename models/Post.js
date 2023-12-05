const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    image: [{
      type: String,
    }],
    title: {
      type: String,
      required: [true, "Please, enter a title"],
    },
    description: {
      type: String,
      required: [true, "Please, enter description"],
    },
    sex: {
      type: String,
      required: [true, "Please, enter sex"],
    },
    color: {
      type: String,
      required: [true, "Please, enter color"],
    },
    size: [{ type: String, required: true }],
    likes: [{ type: ObjectId, ref: "User" }],
    userId: { type: ObjectId, ref: "User" },
    commentIds: [{ type: ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
