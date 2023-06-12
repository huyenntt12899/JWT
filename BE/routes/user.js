const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userControllers");

const router = require("express").Router();

//get all users
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

//delete user
router.delete(
  "/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.deleteUser
);

module.exports = router;
