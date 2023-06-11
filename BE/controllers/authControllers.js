const bcrypt = require("bcrypt");
const User = require("../models/User.js");

const authController = {
  //register
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //save to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Wrong username and password");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        res.status(404).json("Wrong username and password");
      }
      if (user && validPassword) {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = authController;
