const Order = require("../models/Order");
const User = require("../models/User");

const OrderController = {
  async create(req, res, next) {
    try {
      const order = await Order.create({
        ...req.body,
        userId: req.user._id,
        productIds: [req.body.productIds],
      });
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { orderIds: order._id } },
        { new: true }
      );

      res.status(201).send({ message: "Order placed successfully", order });
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error creating the order");
      next(error);
    }
  },
};

module.exports = OrderController;