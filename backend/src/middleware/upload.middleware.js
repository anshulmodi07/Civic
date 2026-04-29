import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads", "complaints"));
  },
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname || ".jpg") || ".jpg";
    cb(null, `complaint_${Date.now()}_${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

export const uploadComplaintImages = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 5 },
});

