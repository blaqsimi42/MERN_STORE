import { useSelector } from "react-redux";
import React from "react";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product.jsx";
import { Link } from "react-router";
import { FaSearch } from "react-icons/fa";
import { Heart } from "lucide-react"; // ❤️ subtle lucide heart glow

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[1rem] md:ml-[6rem] lg:ml-[8rem]">
      {/* 🩷 Header */}
      <div className="flex items-center gap-2 ml-[3rem] mt-[3rem]">
        <Heart
          size={24}
          className="text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]"
        />
        <h1 className="text-lg font-bold tracking-wide text-white">
          FAVORITE PRODUCTS ({favorites.length})
        </h1>
      </div>

      {/* 🕵️ Empty State */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center mt-[12rem] mr-[1rem] md:mr-[7rem] gap-3 text-center bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-lg shadow-black/40 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-pink-500/20">
          <div className="p-4 bg-pink-500/10 rounded-full border border-pink-600/30">
            <FaSearch size={24} className="text-pink-400" />
          </div>
          <p className="font-semibold text-white text-base">
            No favorite item found
          </p>
          <Link
            to="/shop"
            className="text-pink-400 text-sm hover:text-pink-300 underline-offset-2 hover:underline transition"
          >
            Get items to your favorites
          </Link>
        </div>
      ) : (
        <>
          {/* 🛍️ Favorites Grid */}
          <div className="flex flex-wrap mt-6 gap-4">
            {favorites.map((product) => (
              <div
                key={product._id}
                className="transition-transform hover:scale-[1.02]"
              >
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;
