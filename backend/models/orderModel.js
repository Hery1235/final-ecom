var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  userId: {
    type: String,
    required: true, // Ensure that userId is required
  },
  orderId: {
    type: String,
    required: true, // Add required where necessary
  },
  oderName: {
    type: String,
    required: true, // Add required where necessary
  },
  orderPhoneNumber: {
    type: String,
    required: true,
  },
  orderEmail: {
    type: String,
    required: true,
  },
  orderAdress: {
    type: String,
    required: true,
  },
  totalPaid: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  cartData: [
    {
      productId: {
        type: String,
        default: null,
      },
      S: {
        type: Number,
        default: 0,
      },
      M: {
        type: Number,
        default: 0,
      },
      L: {
        type: Number,
        default: 0,
      },
      XL: {
        type: Number,
        default: 0,
      },
      XXL: {
        type: Number,
        default: 0,
      },
    },
  ],
});
module.exports = mongoose.model("order", orderSchema);
