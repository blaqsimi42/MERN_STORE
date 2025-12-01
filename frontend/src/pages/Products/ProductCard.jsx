import { Link } from "react-router-dom";
import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      autoClose: 2000,
    });
  };

  return (
    <div className="relative bg-[#1A1A1A] rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
      {/* ✅ Product Image Section */}
      <div className="relative group">
        <Link to={`/product/${p._id}`}>
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-40 sm:h-52 md:h-60 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* ✅ Hover Overlay (Price) */}
          <div className="absolute inset-0 h-[10.3rem]  md:h-[15.4rem] bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-pink-400 text-lg font-semibold">
              {p?.price?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
          </div>

          {/* ✅ Brand Label */}
          <span className="absolute bottom-1 right-3 bg-pink-100 text-pink-800 text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 translate-y-[rem] md:translate-y-0 mr-4 sm:mr-8 md:mr-4">
            {p?.brand}
          </span>
        </Link>

        {/* ✅ Heart Icon */}
        <div className="absolute top-0 right-24 sm:right-36">
          <HeartIcon product={p} />
        </div>
      </div>

      {/* ✅ Product Info Section */}
      <div className="p-3 sm:p-5 flex flex-col justify-between h-44 sm:h-52 md:h-56">
        {/* Product Name & Price */}
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <h5 className="text-sm sm:text-lg font-semibold text-white truncate w-[70%]">
            {p?.name}
          </h5>
          <p className="font-semibold text-pink-500 text-sm sm:text-base hidden group-hover:block transition-opacity duration-300">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        {/* Description (Reduced spacing on mobile) */}
        <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2 md:mb-3 line-clamp-2">
          {p?.description?.substring(0, 80)}...
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center mt-auto">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-2 focus:ring-pink-400"
          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
