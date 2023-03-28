const express = require('express')
const { registerUser, loginUser, getMe, updateUser, deleteUser, changePassword, getAllUsers, changeRoleAndStatus } = require('../controller/userController')
const {authorizeUser, authorizeAdmin} = require('../middleware/auth')
const router = new express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/", authorizeAdmin, getAllUsers)
router.get("/me", authorizeUser, getMe)
router.patch("/update", authorizeUser, updateUser)
router.patch("/change", authorizeAdmin, changeRoleAndStatus)
router.patch("/changepassword", authorizeUser, changePassword)
router.delete("/delete/:userId", authorizeAdmin, deleteUser)

module.exports = router