const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema(
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
    postId: { type: ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
