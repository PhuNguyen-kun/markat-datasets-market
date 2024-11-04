const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const database = require("./index.js");
database.connectMongoDb();

const ImageSchema = new mongoose.Schema({
  ID_dataset: String,
  ID_version: String,
  ID_part: String,
  base64Image: String,
  sender: String,
  labels: [
    {
      labeler: String,
      label: String
    }
  ]
}, { _id: false }); // _id: false để không tạo _id cho embedded schema

const DatasetSchema = new mongoose.Schema({
  ID_dataset: String,
  Label: [String],
  Image: {
    type: ImageSchema,
    required: false,
  }
}, { collection: 'Dataset' });

const Dataset = mongoose.model('Dataset', DatasetSchema);

const uploadImagesToMongo = async () => {
  try {
    const files = fs.readdirSync(imageDirectory);
    for (let index = 1; index <= 4; index++) {
        const imageDirectory = path.join(__dirname, '..', 'package/Datasets/Collection', index);
        for (const [index, fileName] of files.entries()) {
            const filePath = path.join(imageDirectory, fileName);
            const fileBuffer = fs.readFileSync(filePath);
            const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

            const newDataset = new Dataset({
                ID_dataset: fileName,
                Label: ["daisy","dandelion","roses","sunflowers","tulips"],
                Image: {
                ID_dataset: `data_${index + 1}`,
                ID_version: `v${index + 1}`,
                ID_part: `${index + 1}`,
                base64Image: base64Image,
                sender: "user_01",
                labels: [
                    { labeler: "user_01", label: "0" },
                    { labeler: "user_02", label: "1" }
                ]
                }
            });

        await newDataset.save();
        console.log(`Document for ${fileName} saved successfully!`);
        }
    }
  } catch (error) {
    console.error("Error uploading images:", error);
  } finally {
    mongoose.connection.close();
  }
};


const printAllDatasets = async () => {
  try {
    const datasets = await Dataset.find();
    console.log("All datasets in MongoDB:");
    console.log(datasets);
  } catch (error) {
    console.error("Error retrieving datasets:", error);
  } finally {
    mongoose.connection.close();
  }
};

const countDatasets = async () => {
  try {
    const count = await Dataset.countDocuments();
    console.log("Total number of datasets:", count);
  } catch (error) {
    console.error("Error counting datasets:", error);
  } finally {
    mongoose.connection.close();
  }
};

const addLabelToImage = async (datasetId, newLabel) => {
  await Dataset.updateOne(
    { ID_dataset: datasetId },
    { $push: { "Image.labels": newLabel } }
  );
};

// Gọi hàm uploadImagesToMongo
uploadImagesToMongo();
// Gọi hàm để đếm tổng số datasets
//countDatasets();
// Gọi hàm in tất cả datasets
// printAllDatasets();
// Thêm một nhãn mới
//addLabelToImage("data_1", { labeler: "user_03", label: "2" });