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
    toast.success("Item added successfully", { autoClose: 1500 });
  };

  return (
    <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-2xl shadow-md overflow-hidden border border-gray-800 hover:border-pink-600 transition-all duration-400 group hover:shadow-pink-500/20 hover:-translate-y-1">
      {/* ✅ Product Image */}
      <div className="relative">
        <Link to={`/product/${p._id}`}>
          <div className="overflow-hidden">
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-36 md:h-44 object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-2">
            <p className="text-pink-400 text-[13px] font-semibold">
              {p?.price?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
          </div>

          {/* Brand Label */}
          <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-medium px-2 py-[2px] rounded-full border border-pink-500/40 backdrop-blur-sm">
            {p?.brand}
          </span>
        </Link>

        {/* ❤️ Heart */}
        <div className="absolute top-[-13rem] right-[-3rem]">
          <HeartIcon product={p} />
        </div>
      </div>

      {/* ✅ Product Info */}
      <div className="p-2.5 flex flex-col justify-between h-28">
        <div>
          <h5 className="text-[13px] sm:text-sm font-semibold text-white truncate mb-0.5">
            {p?.name}
          </h5>
          <p className="text-[10px] sm:text-[11px] text-gray-400 line-clamp-2 leading-snug">
            {p?.description?.substring(0, 60)}...
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center text-[11px] font-medium text-white bg-pink-600 hover:bg-pink-700 px-2.5 py-1.5 rounded-md transition-all duration-300 shadow hover:shadow-pink-400/30"
          >
            View
            <svg
              className="w-3 h-3 ml-1"
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
            onClick={() => addToCartHandler(p, 1)}
            className="p-1.5 bg-gray-800 hover:bg-pink-600 rounded-full transition-all duration-300 shadow hover:shadow-pink-400/20"
          >
            <AiOutlineShoppingCart
              size={16}
              className="text-white group-hover:rotate-6 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
