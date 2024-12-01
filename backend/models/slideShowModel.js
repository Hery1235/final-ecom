var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var slideShowSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("slideShow", slideShowSchema);
