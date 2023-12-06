const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please, enter an email"],
      match: [/.+\@.+\..+/, "Enter a valid email"],
      unique: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, "Please, enter a Zip Code"],
    },
    firstName: {
      type: String,
      required: [true, "Please, enter a First Name"],
    },
    lastName: {
      type: String,
      required: [true, "Please, enter a Last Name"],
    },
    password: {
      type: String,
      required: [true, "Please, enter a password"],
    },
    shoppingPreference: String,
    dateOfBirth: {
      type: Date,
    },
    emailUpdates: Boolean,
    agree: {
      type: String,
      required: [true, "Please, first agree with the Privacy Policy and Terms of Use"],
    },
    role: {
      type: String,
      default: "user",
    },
    confirmed: Boolean,
    tokens: [],
    orderIds: [{ type: ObjectId, ref: "Order" }],
    productIds: [{ type: ObjectId, ref: "Product" }],
    likesList: [{ type: ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  delete user.role;
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
