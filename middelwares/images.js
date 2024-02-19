import multer from 'multer';

const imagedata = multer().single("image");
const multipleimageUpload = multer().array("image", "4");

export  {
  imagedata,
  multipleimageUpload
} 