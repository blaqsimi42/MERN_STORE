import React from "react";
import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice.js";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage.js";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id == product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, []);

  const toggleFavorites = () => {
         if (isFavorite) {
          dispatch(removeFromFavorites(product))
          // remove product from LS
          removeFavoriteFromLocalStorage(product._id)
         } else {
          dispatch(addToFavorites(product));
          //add product to LS
          addFavoriteToLocalStorage(product);
         }
  };

  return (
    <div
      onClick={toggleFavorites}
      className="absolute top-54 right-15 cursor-pointer"
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500" size={20} />
      ) : (
        <FaRegHeart className="text-white" size={20} />
      )}
    </div>
  );
};

export default HeartIcon;
