import path from "path";
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const router = express.Router();
const __dirname = path.resolve();

// ✅ Cloudinary config (only activates if keys exist)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: "No image file provided" });
    }

    try {
      // ✅ In production: Upload to Cloudinary
      if (
        process.env.NODE_ENV === "production" &&
        process.env.CLOUDINARY_CLOUD_NAME
      ) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "uploads",
        });

        // Remove local file after upload
        fs.unlinkSync(req.file.path);

        return res.status(200).send({
          message: "Image uploaded successfully",
          image: result.secure_url,
        });
      }

      // 💻 In dev: Return local path
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`,
      });
    } catch (uploadError) {
      console.error(uploadError);
      res.status(500).send({
        message: "Image upload failed",
        error: uploadError.message,
      });
    }
  });
});

export default router;
