import React from "react";
import { useSelector } from "react-redux";

const FavoritesCountBottom = () => {
          const favorite = useSelector(state => state.favorites)
          const favoriteCount  = favorite.length;

  return <div className="absolute left-4 top-2 translate-y-[-1rem]">
          {favoriteCount > 0 && (
                    <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                              {favoriteCount}
                    </span>
          )}
  </div>;
};

export default FavoritesCountBottom;
