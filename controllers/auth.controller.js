const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const { clearRes, createJWT } = require("../utils/utils");

exports.signupProcess = (req, res, next) => {
  //el params llega por el :id
  //los queries llegan con el ?
  //del frontend llega al backend con body
  //vamos a sacar el rol

  //utilizando el spread operator, meto toda esta info extra que me envian
  const { role, email, password, confirmPassword, ...restUser } = req.body;

  if (!email.length || !password.length || !confirmPassword.length)
    return res
      .status(400)
      .json({ errorMessage: "No debes mandar campos vacíos." });

  if (password != confirmPassword)
    return res
      .status(400)
      .json({ errorMessage: "La contraseña no son iguales!" });

  //ponle un regex al password.
  //validar que el email existe:
  //{email:email}
  User.findOne({ email })
    .then((found) => {
      if (found)
        return res
          .status(400)
          .json({ errorMessage: "No debes mandar campos vacíos." });

      return bcryptjs
        .genSalt(10)
        .then((salt) => bcryptjs.hash(password, salt))
        .then((hashedPassword) => {
          return User.create({ email, password: hashedPassword, ...restUser });
        })

        .then((user) => {
          const [header, payload, signature] = createJWT(user); //mi jwt ya tiene 3 elementos en un array
          //la destructuración del array se da por posiciones. el primer elemento del array del createJWT se llenara al header. La posicion es la misma. coge la misma posicion. en cambio en destructuracion de objetos, necesita el nombre exacto de la llave.

          //vamosa guardar estos datos en las cookies
          //res.cookie("key_como_se_Va_a_guardar", datoQueVoyAalmacenar)
          res.cookie("headload", `${header}.${payload}`, {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            sameSite: "strict",
            secure: false, //esto va como falso.
          });

          res.cookie("signature", signature, {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            sameSite: "strict",
            secure: false,
          });

          //la respuesta de un json es data : {}
          //pero adentro de ese data tenemos result -> data : {result:{user + aqui va adentro de lo que queremos mandar.}}

          //tambien vamos a limpiar la respuesta de mongoose, convirtiendo el BSON a objecto y eliminar la data basura.

          //mongoose siempre responde con BSON
          const newUser = clearRes(user.toObject());
          res.status(200).json({ user: newUser });
        });
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

exports.loginProcess = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || !email.length || !password.length)
    return res
      .status(401)
      .json({ errorMessage: "no puedes mandar campos vacíos" });

  //validar el password > 9 o colocar el regex;

  User.findOne({ email })
    .then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ errorMessage: "Credenciales invalidas!" });
      //ver si la contraseña es correcta:
      return bcryptjs.compare(password, user.password).then((match) => {
        if (!match)
          return res
            .status(401)
            .json({ errorMessage: "Credenciales invalidas!" });

        //crear nuestro jwt

        const [header, payload, signature] = createJWT(user);

        res.cookie("headload", `${header}.${payload}`, {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
          sameSite: "strict",
          secure: false, //esto va como falso.
        });

        res.cookie("signature", signature, {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
          sameSite: "strict",
          secure: false,
        });

        //vamos a limpiar el response del usuario:
        const newUser = clearRes(user.toObject());
        res.status(200).json({ user: newUser });
      });
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

exports.logoutProcess=(req, res, next)=>{
    res.clearCookie('headload')
    res.clearCookie('signature')
    res.status(200).json({successMessage:"Saliste todo chido."})
}
