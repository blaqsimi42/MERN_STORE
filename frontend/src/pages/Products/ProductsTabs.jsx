import React, { useState } from "react";
import { Link } from "react-router";
import Ratings from "./ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct.jsx";
import Loader from "../../components/Loader.jsx";
import { LoaderCircle } from "lucide-react"; // ✅ Added Lucide loader

const ProductsTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center mt-[4rem] text-white">
        <LoaderCircle className="animate-spin text-pink-500 w-10 h-10 mb-3" />
        <p className="text-gray-300 text-lg">Loading related products...</p>
      </div>
    );

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* --- LEFT SIDE TABS --- */}
      <section className="mr-[5rem] flex flex-col">
        {[
          { id: 1, label: "Make A Review" },
          { id: 2, label: `All Reviews (${product.reviews.length})` },
          { id: 3, label: "Related Products" },
        ].map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 p-4 text-lg cursor-pointer transition-all duration-200 border-l-4 ${
              activeTab === tab.id
                ? "font-bold text-pink-500 border-pink-600 bg-[#1a1a1a]"
                : "text-gray-400 border-transparent hover:border-gray-600 hover:text-white"
            }`}
          >
            {tab.label}
          </div>
        ))}
      </section>

      {/* --- TAB 1: Make a Review --- */}
      {activeTab === 1 && (
        <div className="mt-4">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <div className="my-2">
                <label htmlFor="rating" className="block text-xl mb-2">
                  Ratings
                </label>
                <select
                  id="rating"
                  required
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="p-2 border rounded-lg w-[20rem] md:w-[35rem] text-white  bg-black"
                >
                  <option value="">Select</option>
                  <option value="1">Inferior ★</option>
                  <option value="2">Decent ★★</option>
                  <option value="3.5">Great ★★★</option>
                  <option value="4.5">Excellent ★★★★</option>
                  <option value="5">Exceptional ★★★★★</option>
                </select>
              </div>

              <div className="my-2">
                <label htmlFor="comment" className="block text-xl mb-2">
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows="3"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="p-2 border rounded-lg md:w-[35rem] w-[20rem] bg-black text-white"
                  placeholder="Input Comment here..."
                />
              </div>

              <button
                type="submit"
                disabled={loadingProductReview}
                className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-all duration-200"
              >
                Submit Comment
              </button>
            </form>
          ) : (
            <p>
              Please{" "}
              <Link to="/login" className="text-pink-500 underline">
                sign in
              </Link>{" "}
              to write a review.
            </p>
          )}
        </div>
      )}

      {/* --- TAB 2: All Reviews --- */}
      {activeTab === 2 && (
        <section>
          <div>{product?.reviews?.length === 0 && <p>No Reviews</p>}</div>

          <div>
            {product?.reviews?.map((review) => (
              <div
                key={review._id}
                className="bg-[#1A1A1A] p-4 rounded-lg xl:ml-[2rem] sm:ml-[0rem] md:w-[38rem] w-[22rem] mb-5"
              >
                {/* User Info Section */}
                <div className="flex justify-between items-center">
                  {/* ✅ Profile image before username */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={review?.user?.profileImage || "/uploads/default.png"}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                    />
                    <strong className="text-[#B0B0B0]">{review.name}</strong>
                  </div>

                  <p className="text-[#B0B0B0]">
                    {review.createdAt.substring(0, 10)}
                  </p>
                </div>

                <p className="my-4">{review.comment}</p>

                <Ratings value={review.rating} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- TAB 3: Related Products (with hover price reveal) --- */}
      {activeTab === 3 && (
        <section className="md:ml-[4rem] ml-1 w-[22rem] md:w-[26rem] grid grid-cols-2 gap-8 md:mt-0 mt-[2rem]">
          {!data ? (
            <Loader />
          ) : (
            data.map((product) => (
              <div
                key={product._id}
                className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-pink-600/40 transition-all duration-300 transform hover:scale-105"
              >
                {/* Product Image */}
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[220px] h-[220px] object-cover rounded-xl mr-2"
                  />

                  {/* Price Overlay (appears on hover) */}
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-lg text-gray-200 mb-2 bg-pink-600 p-2 font-semibold rounded-2xl">
                      {product?.price?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </p>
                  </div>

                  {/* Product name (below image) */}
                  <p className="text-center mt-2 text-sm text-gray-300 font-medium">
                    {product.name}
                  </p>
                </Link>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
};

export default ProductsTabs;
