const mongoose = require('mongoose');
const database = require("../config/index.js");
//database.connectMongoDb();

const ImageSchema = new mongoose.Schema({
  ID_version: String,
  ID_part: String,
  base64Image: String,
  sender: String,
  sent_time : String,
  labeled: [
    {
      labeler: String,
      label: String,
      labeling_time : String
    }
  ]
}, { _id: false });

const DataSchema = new mongoose.Schema({
  ID_dataset: String,
  labels: [String],
  image: {
    type: ImageSchema,
    required: false,
  }
}, { collection: 'Data' });

const Data = mongoose.model('Data', DataSchema);
module.exports = Data;