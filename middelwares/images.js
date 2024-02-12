const multer = require("multer");

const file = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+Math.floor((Math.random() * 1000000) + 1)+file.originalname.substr(file.originalname.lastIndexOf('.')));
  }, 
});
 
// const limits = {
//   fileSize: 15 * 1024 * 1024,
// };

const imagedata = multer({ storage: file }).single("image");
const multipleimageUpload = multer({ storage: file }).array("image","4");
// const videodata = multer({ storage: file,limits:limits}).single("video");

module.exports={
    imagedata,
    multipleimageUpload  
} 