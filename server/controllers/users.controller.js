const userService = require("../services/users.service");

const getUserProfile = async (req, res) => {
  try {
    const { id_user } = req.query; // Lấy id_user từ query parameters
    if (!id_user) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Tìm thông tin người dùng dựa trên id_user trong cơ sở dữ liệu
    const user = await userService.getUserById(id_user);
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
    const { id_user } = req.query; // Lấy id_user từ query parameters
    if (!id_user) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Tìm thông tin người dùng dựa trên id_user trong cơ sở dữ liệu
    const userReliability = await userService.getUserReliabilitybyId(id_user);
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
