
const router = require("express").Router();

const {signupProcess,loginProcess,logoutProcess} = require("../controllers/auth.controller")


//para las API mandamos data en post.
//en get solo llamamos data.

router.post("/signup",signupProcess)

//login
router.post("/login",loginProcess)

//log out
router.get("/logout",logoutProcess)

module.exports=router