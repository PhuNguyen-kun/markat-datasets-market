const userService =  require("../services/users.service");

const getUserProfile = async (req, res) => {
    const { id } = req.user;
    const user = await userService.getUserById(id);

    return res.status(200).json(user);
};

module.exports = {
    getUserProfile,
};