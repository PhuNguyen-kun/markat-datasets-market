const YourWorkService = require("../services/yourwork.service");
const getAllYourWorkVersionsByUserId = async (req, res) => {
  try {
    const { user_id } = req.query; // Lấy user_id từ query parameters

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const yourwork = await YourWorkService.getAllYourWorkVersionsByUserId(
      user_id
    );
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
  getAllYourWorkVersionsByUserId,
};
