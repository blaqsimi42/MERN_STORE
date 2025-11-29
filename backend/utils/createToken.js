import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Create JWT
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // ✅ Set JWT as an HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Prevent client-side JS access
    secure: process.env.NODE_ENV === "production", // Use HTTPS cookies in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Enable CORS cookies across domains
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;
