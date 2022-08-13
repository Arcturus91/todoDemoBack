const jwt = require("jsonwebtoken");

exports.clearRes = (data) => {
    const {password,createAt,updatedAt,__v,...restData} = data;
    return restData;
}

exports.createJWT = (user) =>{
    //jwt.sign({valorEncriptar},palabraSecreta,{opciones}) //en las opciones puedo poner cuanto tiempo va a expirar el token.
    //todo eso retorna => dsfsfdsfsf.dsfdsfsd.fdsfsdfsdfsfs, como un string completo separado por puntos.
    //el primer atribudo es el header (cabecera), el segundo atributo es el payload, y el signature
return jwt.sign({
    userId:user._id,
    email:user.email,
    role:user.role
    //aqui puedes guardar lo que te haga falta .. x ejemplo el rol o el username. El password no se manda aquí
},process.env.SECRET,{expiresIn:'24h'}).split(".") //yo hago un split por los puntos qe me da el jwt.
}

