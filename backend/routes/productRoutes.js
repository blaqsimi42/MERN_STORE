import express from "express";
import formidable from "express-formidable";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

//controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductsById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
const router = express.Router();

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router.route("/allproducts").get(fetchAllProducts);
router
  .route("/:id/reviews")
  .post(authenticate, checkId, addProductReview);

router
  .route("/:id")
  .get(fetchProductsById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

router.route('/filtered-products',).post(filterProducts);

export default router;
