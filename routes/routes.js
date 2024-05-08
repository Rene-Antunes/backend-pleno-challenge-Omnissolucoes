const express = require("express")
const router = express.Router()
const authController = require("../Controllers/loginAuth.js")
const userController = require('../Controllers/userController.js')
const authMiddleware = require("../Middleware/tokenAuth.js")
const { wss, broadcastMessage }= require("../Controllers/websocketController.js")

router.post("/login", authController.loginHandler)
router.post(
  "/register",
 userController.userRegister
)

router.post("/messages", (req, res)=>{
  const {text} = req.body

  broadcastMessage({text})

  res.status(201)
  .json({ message: "Message sent successfully", text });
})

router.get(
  "/users",
  authMiddleware.tokenValidator,
  userController.getUserList,
)
router.get(
  '/users/:id',
  authMiddleware.tokenValidator,
  userController.GetUserById,
)
router.put(
  "/update-password",
  authMiddleware.tokenValidator,
  userController.updatePassword
)
router.put(
  '/update-user/:id',
  authMiddleware.tokenValidator,
  userController.updateUser
)
router.delete(
  "/delete",
  authMiddleware.tokenValidator,
  userController.deleteUser
)


module.exports = router
