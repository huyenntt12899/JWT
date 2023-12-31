const User = require("../models/User");

const userController = {
  //get all users
  getAllUsers: async (req, res) => {
    try {
      //get all user in DB
      const user = await User.find();
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  //delete user
  deleteUser: async (req, res) => {
    try {
      //TODO: current just show the message not delete in DB
      const user = await User.findById(req.params.id);
      //   const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Delete user successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = userController;
