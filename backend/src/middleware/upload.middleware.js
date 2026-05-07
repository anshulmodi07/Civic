import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "uploads", "complaints"));
  },
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname || ".jpg") || ".jpg";
    cb(null, `complaint_${Date.now()}_${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

export const uploadComplaintImages = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 5 },
});
