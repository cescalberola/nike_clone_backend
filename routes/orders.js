const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const {
  authentication,
  isAdmin,
  isOrderAuthor,
} = require("../middleware/authentication");

router.post("/", authentication, OrderController.create);
router.get("/:_id", authentication, isOrderAuthor, OrderController.getById);
router.delete(
  "/:_id",
  authentication,
  isOrderAuthor || isAdmin,
  OrderController.delete
);

module.exports = router;
