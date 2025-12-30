import multer from "multer";
import path from "path";
import crypto from "crypto";

const uploadDir = path.resolve("uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString("hex");
    cb(null, `${name}${ext}`)
  },
});

function fileFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback){
  if(!file.mimetype.startsWith("image/")){
    return cb(new Error("Only image uploads are allowed"));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits:{
    fileSize: 5*1024*1024,
    files: 10
  }
});