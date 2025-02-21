import multer from "multer";
import path from "path";

const tempAvatarsDir = path.join(process.cwd(), "temp");

const multerConf = multer.diskStorage({
  destination: tempAvatarsDir,
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const storage = multer({
  storage: multerConf,
});

export default storage;
