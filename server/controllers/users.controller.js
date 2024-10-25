const userService = require("../services/users.service");

const getUserProfile = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await userService.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserReliability = async (req, res) => {
  try {
    const { user_id } = req.query; // Lấy user_id từ query parameters
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Tìm thông tin người dùng dựa trên user_id trong cơ sở dữ liệu
    const userReliability = await userService.getUserReliabilitybyId(user_id);
    if (!userReliability) {
      return res.status(404).json({ message: "User reliability not found" });
    }

    res.status(200).json(userReliability);
  } catch (error) {
    console.error("Error fetching user reliability:", error);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = {
  getUserProfile,
  getUserReliability,
};
