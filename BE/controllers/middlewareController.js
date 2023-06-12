const jwt = require("jsonwebtoken");

const middlewareController = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      //Bearer 122333
      //get access token
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (error, user) => {
        if (error) {
          res.status(403).json("Token is invalid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You are not authenticated");
    }
  },
  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      //Only allow for current user delete themselves or role admin delete all
      if (req.user.id === req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("You are not allowed to delete other");
      }
    });
  },
};

module.exports = middlewareController;
