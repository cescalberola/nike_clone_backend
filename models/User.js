const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please, enter a username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please, enter an email"],
      match: [/.+\@.+\..+/, "Enter a valid email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please, enter a password"],
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    confirmed: Boolean,
    tokens: [],
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    postIds: [{ type: ObjectId, ref: "Post" }],
    likesList: [{ type: ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
