const User = require("../models/User.model");
const mongoose = require("mongoose");
const { clearRes, createJWT } = require("../utils/utils");

exports.getLoggedUser = (req, res, next) => {
  res.status(200).json({ user: req.user });
};

exports.editProfile = (req, res, next) => {
  //destructuramos el rol para qe no lo peudan cambiar;
  const { role, password, ...restUser } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { ...restUser }, { new: true })
    .then((user) => {
      const newUser = clearRes(user.toObject());
      res.status(200).json({ user: newUser });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "El correo electronico ya esta en uso.",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

exports.getUserById = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      const newUser = clearRes(user.toObject());
      res.status(200).json({ user:newUser });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "El correo electronico ya esta en uso.",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};


//esta es para el admin:

exports.onlyAdminRead = (req,res,next) =>{

  User.find( { role: { $ne:"Admin"}}, {password:0,__v:0,createdAt:0,updatedAt:0} ) // estos operadores se ven muy pro.
  .then(users=>{
      res.status(200).json({ users })
  })
  .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "Hubo un error",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
}

//borrar la cuenta del usuario logeado

exports.deleteAccount = (req,res,next) =>{
const {_id} = req.user;
User.findByIdAndRemove(_id)
.then(()=>{
  res.clearCookie('headload')
  res.clearCookie('signature')
  res.status(200).json({successMessage:"Usuario borrado"})
})
.catch((error) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ errorMessage: error.message });
  }
  if (error.code === 11000) {
    return res.status(400).json({
      errorMessage: "Hubo un error",
    });
  }
  return res.status(500).json({ errorMessage: error.message });
})

}