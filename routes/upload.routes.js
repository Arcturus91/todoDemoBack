const router = require("express").Router();

const {uploadProcess,deleteImage} = require ("../controllers/upload.controller");

//vamos a importar mi helper
const uploadCloud = require ("../helpers/cloudinary")

const {verifyToken} = require("../middleware")

//multiples                       //si yo uso array es xq espero meter varias imagenes: req.files
router.post("/uploads",uploadCloud.array("images",3),uploadProcess)
//una sola:                     req.file. Estos metodos .single o .array vienen desde Multer.
router.post("/single",uploadCloud.single("image"),uploadProcess)


router.delete("/delete-image/:name",verifyToken,deleteImage)


module.exports = router;