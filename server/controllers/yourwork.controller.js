const YourWorkService = require("../services/yourwork.service");
const getAllYourWorkVersionsById = async (req, res) => {
  try {
    const {id_user} = req.query; // Lấy id_user từ query parameters
    if (!id_user) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const yourwork = await YourWorkService.getAllYourWorkVersionsById(id_user);
    if (!yourwork) {
      return res.status(404).json({ message: "Your work not found" });
    }
    return res.status(200).json(yourwork);
  } catch (error) {
    console.error("Error fetching your work:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllYourWorkVersionsById,
};
