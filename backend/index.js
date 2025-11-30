// ===============================
// 📦 Packages
// ===============================
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// ===============================
// 🧠 Utils
// ===============================
import connectDB from "./config/db.js";

// ===============================
// 🚦 Routes
// ===============================
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// ===============================
// ⚙️ Config
// ===============================
dotenv.config();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();

// ===============================
// 🧩 Connect to MongoDB
// ===============================
connectDB();

// ===============================
// 🚀 Initialize App
// ===============================
const app = express();

// ===============================
// 🧱 Middleware
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===============================
// 🌐 CORS Setup
// ===============================
const allowedOrigins = [process.env.FRONT_END_DEV, process.env.FRONT_END_PROD];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ===============================
// 🧭 API Routes
// ===============================
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// ===============================
// 💰 Paystack Config
// ===============================
app.get("/api/config/paystack", (req, res) => {
  res.send({ clientId: process.env.PAYSTACK_CLIENT_ID });
});

// ===============================
// 🗂️ Serve Static Uploads
// ===============================
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ===============================
// 🌍 Serve Frontend (Production)
// ===============================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "/frontend/dist");
  app.use(express.static(frontendPath));

  // ✅ Express v5 compatible wildcard route
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully...");
  });
}

// ===============================
// Fallback for Unmatched Routes
// ===============================
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ===============================
//  Start Server
// ===============================
app.listen(port, () => {
  console.log(`✅ Server running on port ${port} (${process.env.NODE_ENV}) 🍃`);
});
