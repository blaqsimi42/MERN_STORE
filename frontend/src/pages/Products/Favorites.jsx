import { useSelector } from "react-redux";
import React from "react"
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product.jsx";
import { Link } from "react-router";
import { FaSadCry, FaSearch } from "react-icons/fa";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[1rem] md:ml-[6rem] lg:ml-[8rem]">
      <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
        FAVORITE PRODUCTS({favorites.length})
      </h1>

        {favorites.length === 0 ? (
          <div className="flex  flex-col items-center mt-[12rem] mr-[1rem] md:mr-[7rem] gap-2 text-center ">
            <FaSearch size={24} className="text-pink-400" />
            <p className="font-semibold text-white">No favorite item found</p>
            <Link to="/shop" className="text-pink-500 hover:underline">
              Get items to your favorites
            </Link>
          </div>
        ) : (
          <>
          <div className="flex flex-wrap">
          {favorites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
        </div>
          </>
        )}


    </div>
  );
};

export default Favorites;
