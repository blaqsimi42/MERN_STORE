import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import {
  FaArrowCircleLeft,
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { LoaderCircle } from "lucide-react"; // ✅ Added Lucide loader
import moment from "moment";
import HeartIcon from "./HeartIcon2";
import Ratings from "./Ratings";
import ProductsTabs from "./ProductsTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: LoadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Reviewed successfully added");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div>
        <Link
          to="/"
          className="text-white font-semibold text-[1.1rem] hover:underline ml-4 md:ml-40 flex gap-2"
        >
          <FaArrowCircleLeft className="translate-y-1" />
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-24 text-white">
          <LoaderCircle className="animate-spin text-pink-500 w-12 h-12 mb-4" />
          <p className="text-gray-300 text-lg">Loading product details...</p>
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          {/* MAIN GRID: unchanged logic; added lg:ml-[4rem] for large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-start mt-8 gap-8 md:px-20 lg:ml-12">
            {/* Image with Overlay (size reduced on md/lg to be less huge) */}
            <div className="relative w-full md:w-md lg:w-132 h-88 lg:h-132 md:h-112 rounded overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded"
              />

              {/* Heart Icon (Top Right Corner) */}
              <div className="absolute top-5 right-8 md:right-10 z-20">
                <HeartIcon product={product} />
              </div>

              {/* Overlay info on image (logic / content unchanged) */}
              <div className="absolute inset-0 bg-black/50 text-white flex flex-col justify-end p-4 md:p-6 rounded">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">
                  {product?.price?.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </h2>
                <div className="grid grid-cols-2 gap-x-8 text-[0.9rem] md:text-[1rem]">
                  <div>
                    <p className="flex items-center gap-2 mb-2">
                      <FaStore className="text-blue-400" /> Brand:{" "}
                      {product.brand}
                    </p>
                    <p className="flex items-center gap-2 mb-2">
                      <FaClock className="text-orange-400" /> Added:{" "}
                      {moment(product.createdAt).fromNow()}
                    </p>
                    <p className="flex items-center gap-2 mb-2">
                      <FaStar className="text-yellow-400" /> Reviews:{" "}
                      {product.numReviews}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 mb-2">
                      <FaStar className="text-yellow-400" /> Rating:{" "}
                      {product.rating}
                    </p>
                    <p className="flex items-center gap-2 mb-2">
                      <FaShoppingCart className="text-green-400" /> Quantity:{" "}
                      {product.quantity}
                    </p>
                    <p className="flex items-center gap-2 mb-2">
                      <FaBox className="text-purple-400" /> In Stock:{" "}
                      {product.countInStock}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info (kept original logic; tightened description width for lg) */}
            <div className=" flex flex-col justify-start  md:ml-8 w-full">
              <h2 className="text-xl md:text-2xl font-semibold ml-4 md:ml-0">
                {product.name}
              </h2>

              <p className="mt-4 text-[#B0B0B0] w-92 lg:w-120 ml-4 md:ml-0">
                {product.description}
              </p>

              <div className="mt-4 flex justify-start ml-4 md:ml-0">
                <Ratings
                  value={product.numReviews}
                  text={`${product.numReviews} Reviews`}
                />
              </div>

              <div className="grid grid-cols-2 mt-4 border-t pt-4 border-gray-400">
                <div className="mr-4 md:mr-16">
                  {product.countInStock > 0 && (
                    <div className="ml-2 md:ml-12">
                      <select
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="p-2 w-20 rounded-lg bg-black text-white"
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="btn-container flex justify-center md:justify-start mr-8 md:mr-0">
                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0 hover:bg-pink-700 w-full md:w-auto"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs Section (unchanged) */}
            <div className="mt-12 w-full md:w-[90%] flex flex-wrap items-start justify-center md:justify-between">
              <ProductsTabs
                LoadingProductReview={LoadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
