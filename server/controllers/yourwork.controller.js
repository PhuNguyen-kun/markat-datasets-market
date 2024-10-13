const YourWorkService = require("../services/yourwork.service");
const getAllYourWorkVersions = async (req, res) => {
  const id_user = req.body;
  const request = await YourWorkService.getAllYourWorkVersions(1);
  return res.status(200).json(request);
};

module.exports = {
  getAllYourWorkVersions,
};
