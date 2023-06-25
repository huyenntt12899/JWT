const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

//list refresh Token storage refresh token was allocated
let refreshTokenList = [];
const authController = {
  //register
  registerUser: async (req, res) => {
    try {
      //encrypt password
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
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  //access token
  generateAccessToken: (user) => {
    //sign access token
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "1d",
      }
    );
  },
  //refresh token
  generateRefreshToken: (user) => {
    //sign access token
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: "365d",
      }
    );
  },
  //login
  loginUser: async (req, res) => {
    try {
      //find user unique in DB
      const user = await User.findOne({ username: req.body.username });
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      //check user is invalid
      if (!user || !validPassword) {
        return res.status(404).json("Wrong username or password");
      }
      //check user valid
      if (user && validPassword) {
        //create access token
        const accessToken = authController.generateAccessToken(user);
        //create refresh token
        const refreshToken = authController.generateRefreshToken(user);
        //push new refresh token to list
        refreshTokenList.push(refreshToken);
        //save refresh token in Cookies
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  requestRefreshToken: async (req, res) => {
    //take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    //check refresh token invalid
    if (!refreshToken) return res.status(401).json("You are not authenticated");
    if (refreshTokenList.includes(refreshToken)) {
      return res.status(403).json("Refresh token is invalid");
    }
    //verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        return res.status(401).json("You are not authenticated");
      } else {
        //remove previous refresh token to provide new refresh token
        refreshTokenList = refreshTokenList.filter(
          (token) => token !== refreshToken
        );
        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);
        refreshTokenList.push(newRefreshToken);
        //save refresh token to cookies
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        return res.status(200).json({ accessToken: newAccessToken });
      }
    });
  },
  //logout
  userLogout: async (req, res) => {
    //clear refresh token in cookie
    res.clearCookie("refreshToken");
    //remove out list refresh
    refreshTokenList = refreshTokenList.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json("Logged out");
  },
};

module.exports = authController;
