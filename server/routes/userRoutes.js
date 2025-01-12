const {register, googleLogin, setAvatar, getAllUsers} = require("../controllers/usersController.js")

const router = require("express").Router()

router.post("/register", register)
router.post("/login", googleLogin)
router.post("/setAvatar/:id", setAvatar)
router.get('/allusers/:id', getAllUsers)

module.exports = router;