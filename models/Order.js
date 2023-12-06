const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const OrderSchema = new mongoose.Schema(
    {
        status: String,
        userId: { type: ObjectId, ref: "User" },
        productIds: [{ type: ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

// OrderSchema.methods.toJSON = function () {
//     const order = this._doc;
//     delete order.tokens;
//     delete order.password;
//     return order;
// };

const Order = mongoose.model("Prder", OrderSchema);

module.exports = Order;
