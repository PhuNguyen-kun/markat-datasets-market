const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const database = require("./index.js");
database.connectMongoDb();

const ImageSchema = new mongoose.Schema({
  //ID_dataset: String,
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

const DatasetSchema = new mongoose.Schema({
  ID_dataset: String,
  labels: [String],
  image: {
    type: ImageSchema,
    required: false,
  }
}, { collection: 'Dataset' });

const labels = ["curly", "dreadlocks", "kinky", "straight", "wavy"];
const senders = ["13"];
const labelers = ["1"];
const getRandomSender = () => senders[Math.floor(Math.random() * senders.length)];
const getRandomLabeler = () => labelers[Math.floor(Math.random() * labelers.length)];
const getRandomLabel = () => labels[Math.floor(Math.random() * labels.length)];
const getRandomValue = (number) => (Math.floor(Math.random() * number) + 1).toString();
// select id_user from user_version_participation where id_version = 1 and participation_type = 'Labeling';
// select id_user from user_version_participation where id_version = 1 and participation_type = 'Sending';
const Dataset = mongoose.model('Dataset', DatasetSchema);

const getRandomLabeledForUsers = (number) => {
  const labelCount = Math.floor(Math.random() * number) + 1;
  return Array.from({ length: labelCount }, () => ({
    labeler: getRandomLabeler(),
    label: getRandomLabel(),
  }));
};

const getRandomTimeBetween = (start, end) => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomTime = new Date(startDate + Math.random() * (endDate - startDate));
  return randomTime.toISOString().replace('T', ' ').substring(0, 19);
};

const uploadImagesToMongo = async () => {
  try {
    for (let index = 2; index <= 2; index++) {
      const imageDirectory = path.join(__dirname, '..', 'package/Datasets/Collections', index.toString());
      const files = fs.readdirSync(imageDirectory);
      for (const [fileIndex, fileName] of files.entries()) {
        const filePath = path.join(imageDirectory, fileName);
        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

        const newDataset = new Dataset({
          ID_dataset: '2',
          labels: labels,
          image: {
            ID_version: '11',
            ID_part: getRandomValue(10),
            base64Image: base64Image,
            sender: getRandomSender(),
            labeled: getRandomLabeledForUsers(5)
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
    { $push: { "image.labeled": newLabel } }
  );
};

const random = async () => {
  //for (let i = 0; i < 15; i++) {
    const time = getRandomTimeBetween('2024-01-05 01:04:11', '2024-07-11 21:37:19');
    console.log(time);
  //}
};

// Gọi hàm uploadImagesToMongo
//uploadImagesToMongo();
// Gọi hàm để đếm tổng số datasets
//countDatasets();
// Gọi hàm in tất cả datasets
// printAllDatasets();
// Thêm một nhãn mới
// addLabelToImage("data_1", { labeler: "user_03", label: "2" });
//sinh ngẫu nhiên ngày
random();
