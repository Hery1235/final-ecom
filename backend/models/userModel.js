var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
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

  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("user", userSchema);
