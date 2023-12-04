const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    // title: {
    //   type: String,
    //   required: [true, "Please, enter a title"],
    // },
    content: {
      type: String,
      required: [true, "Please, enter content"],
    },
    image: {
      type: String,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    userId: { type: ObjectId, ref: "User" },
    commentIds: [{ type: ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
