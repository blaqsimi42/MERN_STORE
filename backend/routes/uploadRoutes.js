import path from "path";
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

const router = express.Router();
const __dirname = path.resolve();

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// ✅ Conditional storage setup
let storage;

// Use direct Cloudinary uploads in production
if (process.env.NODE_ENV === "production") {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "uploads",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });
} else {
  // Use local storage in development
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    },
  });
}

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;
  if (filetypes.test(extname) && mimetypes.test(mimetype)) cb(null, true);
  else cb(new Error("Images only"), false);
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

// ✅ Upload endpoint
router.post("/", async (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) return res.status(400).send({ message: err.message });
    if (!req.file)
      return res.status(400).send({ message: "No image file provided" });

    try {
      // CloudinaryStorage automatically returns a `path` field with the Cloudinary URL in production
      const imageUrl =
        process.env.NODE_ENV === "production"
          ? req.file.path
          : `/${req.file.path}`;

      return res.status(200).send({
        message: "Image uploaded successfully",
        image: imageUrl,
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
