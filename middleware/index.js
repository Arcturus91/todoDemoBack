//vamos a crear un middleware que verifique si mi usuario está logeado y además otro que verifique el rol:

const jwt = require ("jsonwebtoken")
const User = require ("../models/User.model");
const {clearRes} =require("../utils/utils")
  
exports.verifyToken = (req, res, next)=>{
    // 1. vamos a destructurar las cookies
    const {headload,signature} =req.cookies;

    if(!headload || !signature) return res.status(401).json({errorMessage:"no estás autorizado"});

    //jwt.verify(jwt,elsecreto,(err,decoded)=>{})

    jwt.verify(`${headload}.${signature}`, process.env.SECRET, (error,decoded)=>{

        if(error){
            return res.status(401).json({errorMessage:"No estás autorizado"});
        }


   

    User.findById(decoded.userId).
    then(user=>{
        req.user = clearRes(user.toObject())
        next()

    }) 

.catch(error=>{

    res.status(401).json({errorMessage:"wey"})
})

})

}


exports.checkRole = (arrayRoles) =>{
    return (req,res,next) =>{
        const {role} = req.user
        if (arrayRoles.includes(role)){
            next()
        } else {
            res.status(401).json({errorMessage:"no tienes permiso para realizar esta acción"})
        }
    }
}