const router = require("express").Router();

const {getLoggedUser,editProfile,getUserById,deleteAccount,onlyAdminRead} = require ("../controllers/user.controller");

const {verifyToken,checkRole} = require ("../middleware")

router.get("/my-profile", verifyToken, getLoggedUser)

router.patch("/edit-profile", verifyToken, editProfile)

router.delete("/delete-user",verifyToken,deleteAccount)

//read - other user

router.get("/:id/profile",verifyToken, getUserById)

//read all user (para admin staff)

router.get("/admin/users",verifyToken,  checkRole(["Admin"]),onlyAdminRead)



module.exports = router;