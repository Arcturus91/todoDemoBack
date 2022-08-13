const router = require("express").Router();

const {getLoggedUser,editProfile} = require ("../controllers/user.controller");

const {verifyToken} = require ("../middleware")

router.get("/my-profile", verifyToken, getLoggedUser)

router.patch("/edit-profile", verifyToken, editProfile)

//router.delete("/delete-user")

//read - other user

router.get("/:id/profile")



module.exports = router;