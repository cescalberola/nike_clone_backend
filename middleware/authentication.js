const User = require("../models/User");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, jwt_secret);
    const user = await User.findOne({ _id: payload._id, tokens: token });
    if (!user) {
      return res.status(404).send({ msg: "Not authorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(404).send({ msg: "There was a problem with the token" });
  }
};

const isAdmin = async (req, res, next) => {
  const admins = ["admin", "superadmin"];
  if (!admins.includes(req.user.role)) {
    return res.status(403).send({ msg: `You don't have permission` });
  }
  next();
};

const isSuperAdmin = async (req, res, next) => {
  const admins = ["superadmin"];
  if (!admins.includes(req.user.role)) {
    return res.status(403).send({ msg: `You don't have permission` });
  }
  next();
};

const isProductAuthor = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params._id);
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ msg: `Is not your product` });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      msg: "There was an error when checking the author of the product",
    });
  }
};

const isOrderAuthor = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params._id);
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ msg: `Is not your order` });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      msg: "There was an error when checking the author of the order",
    });
  }
};

const isReviewAuthor = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params._id);
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ msg: `Is not your product` });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      msg: "There was an error when checking the author of the product",
    });
  }
};

module.exports = {
  authentication,
  isAdmin,
  isSuperAdmin,
  isProductAuthor,
  isReviewAuthor,
  isOrderAuthor,
};
