const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const database = require("./index.js");
const { log } = require('console');
// database.connectMongoDb();

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
// id_version = 1
// const labels = ["daisy", "dandelion", "roses", "sunflowers", "tulips"];
// const senders = ["1","19"];
// const labelers = ["2", "14", "26"];

// id_version = 2
// const labels = ["curly", "dreadlocks", "kinky", "straight", "wavy"];
// const senders = ["13"];
// const labelers = ["1", "17"];

// id_version = 11
const labels = ["daisy", "dandelion", "roses", "sunflowers", "tulips"];
const senders = ["1"];
const labelers = ["1"];

const getRandomSender = () => senders[Math.floor(Math.random() * senders.length)];
const getRandomLabeler = () => labelers[Math.floor(Math.random() * labelers.length)];
const getRandomLabel = () => labels[Math.floor(Math.random() * labels.length)];
const getRandomValue = (number) => (Math.floor(Math.random() * number) + 1).toString();
const getRandomValueBetween = (min, max) => {
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

// select id_user from user_version_participation where id_version = 1 and participation_type = 'Labeling';
// select id_user from user_version_participation where id_version = 1 and participation_type = 'Sending';

const Data = mongoose.model('Data', DataSchema);
const getRandomLabeledForUsers = (number) => {
  const labelCount = Math.floor(Math.random() * number) + 1;
  const uniqueLabelers = new Set();

  while (uniqueLabelers.size < labelCount) {
    if (uniqueLabelers.size === labelers.length) break;
    uniqueLabelers.add(getRandomLabeler());
  }

  return Array.from(uniqueLabelers).map(labeler => ({
    labeler: labeler,
    label: getRandomLabel(),
    // id_version = 1
    // labeling_time: getRandomTimeBetween('2024-06-15 10:30:00', '2024-07-11 21:37:19'),
    // id_version =2
    // labeling_time: getRandomTimeBetween('2024-12-20 12:00:00', '2024-12-26 16:39:59'),
    // id_version = 11
    labeling_time: getRandomTimeBetween('2025-12-05 10:00:00', '2025-12-07 17:18:42'),
  }));
};

const getRandomTimeBetween = (start, end) => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomTime = new Date(startDate + Math.random() * (endDate - startDate));
  return randomTime.toISOString().replace('T', ' ').substring(0, 19);
};

const getRandomTimes = (start, end) => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();

  // Tạo 2 giá trị ngẫu nhiên giữa 0 và 1, sau đó sắp xếp để đảm bảo thứ tự
  const randomFactors = [Math.random(), Math.random()].sort((a, b) => a - b);

  // Tính toán các mốc thời gian
  const time1 = new Date(startDate + randomFactors[0] * (endDate - startDate));
  const time2 = new Date(startDate + randomFactors[1] * (endDate - startDate));
  const time3 = new Date(startDate + Math.random() * (endDate - startDate));

  // Sắp xếp để đảm bảo time1 < time2 < time3
  const times = [time1, time2, time3].sort((a, b) => a - b);

  // Trả về mảng 3 thời gian dưới định dạng yyyy-MM-dd HH:mm:ss
  return times.map((time) =>
    time.toISOString().replace('T', ' ').substring(0, 19)
  );
};

const uploadImagesToMongo = async () => {
  try {
    for (let index = 1; index <= 1; index++) {
      const imageDirectory = path.join(__dirname, '..', 'package/Datasets/Collections', index.toString());
      const files = fs.readdirSync(imageDirectory);
      for (const [fileIndex, fileName] of files.entries()) {
        const filePath = path.join(imageDirectory, fileName);
        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
        const sizeInBytes = (base64Image.length * (3 / 4)) - ((base64Image.endsWith('==') ? 2 : base64Image.endsWith('=') ? 1 : 0));
        // Convert bytes to megabytes (KB)
        const sizeInMB = sizeInBytes / (1024);
        console.log(sizeInMB);

        // const newDataset = new Dataset({
        //   ID_dataset: '1',
        //   labels: labels,
        //   image: {
        //     ID_version: '11',
        //     ID_part: getRandomValueBetween(21,30),
        //     base64Image: base64Image,
        //     sender: getRandomSender(),
        //     // id_version = 1
        //     // sent_time: getRandomTimeBetween('2024-01-03 12:00:00', '2024-01-05 01:04:11'),
        //     // id_version = 2
        //     // sent_time : getRandomTimeBetween('2024-03-01 09:30:00','2024-05-12 12:20:30'),
        //     // id_version = 11
        //     sent_time : getRandomTimeBetween('2025-12-03 10:00:00','2025-12-04 07:27:30'),
        //     labeled: getRandomLabeledForUsers(5)
        //   }
        // });

        //await newDataset.save();
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
    const datasets = await Data.find();
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
    const count = await Data.countDocuments();
    console.log("Total number of datasets:", count);
  } catch (error) {
    console.error("Error counting datasets:", error);
  } finally {
    mongoose.connection.close();
  }
};

const addLabelToImage = async (datasetId, newLabel) => {
  await Data.updateOne(
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

// Hàm query đếm số bản ghi có ID_part = 1
const countRecordsWithIDPart = async () => {
  try {
    // Thực hiện query đếm số bản ghi
   for (let index = 1; index <= 30; index++) {
    const Number_of_record = await Data.countDocuments({ 'image.ID_part': `${index}` });
    const ID_version = await Data.findOne({ "image.ID_part": `${index}` }, { "image.ID_version": 1, _id: 0 });
    console.log('(', ID_version.image.ID_version, ',' , index, ',', Number_of_record, '),');
  }

    // Đóng kết nối sau khi hoàn thành
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error querying the database:', error);
  }
};
const roundDownToTwoDecimals = (value) => {
  console.log(value);
  console.log(Math.floor(value * 100) / 100);
  return Math.floor(value * 100) / 100;
};
// Gọi hàm uploadImagesToMongo
// uploadImagesToMongo();
// Gọi hàm để đếm tổng số datasets
//countDatasets();
// Gọi hàm in tất cả datasets
// printAllDatasets();
// Thêm một nhãn mới
// addLabelToImage("data_1", { labeler: "user_03", label: "2" });
//sinh ngẫu nhiên ngày
// random();
// countRecordsWithIDPart();
// roundDownToTwoDecimals(15/36);
const genTime = () => {
  for (let index = 0; index < 20; index++)
  {
    console.log(getRandomTimes('2024-01-01 10:00:00', '2024-12-30 23:59:59'));
  }
}

// genTime();
