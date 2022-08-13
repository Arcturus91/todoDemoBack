const User = require ("../models/User.model")
const mongoose = require("mongoose");
const { clearRes, createJWT } = require("../utils/utils");

exports.getLoggedUser = (req,res,next)=>{

res.status(200).json({user:req.user})    
}

exports.editProfile = (req,res,next)=>{
    //destructuramos el rol para qe no lo peudan cambiar;
const { role, password, ...restUser} = req.body;
const {_id} = req.user
User.findByIdAndUpdate(_id,{...restUser},{new:true})
.then(user=>{
    const newUser = clearRes(user.toObject());
res.status(200).json({user:newUser})
})
.catch(

    (error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage: "El correo electronico ya esta en uso.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      }
)

}