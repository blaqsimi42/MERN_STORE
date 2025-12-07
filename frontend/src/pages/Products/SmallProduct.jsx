import React from "react";
import { Link } from "react-router-dom";
import TopHeartIcon from "./TopHeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[16rem] p-3">
      <Link to={`/product/${product._id}`}>
        <div className="relative hover:scale-105 duration-300 ease-in-out cursor-pointer">
          {/* Product image */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="md:h-[15rem] md:w-[15rem] h-[9rem] w-[9rem] rounded object-cover"
          />

          {/* Heart icon */}
          <div className="">
            <TopHeartIcon product={product} />
          </div>

          {/* Price tag */}
          <div className="absolute left-2 bottom-12 bg-pink-600 bg-opacity-90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            {product?.price?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </div>

          {/* Product name */}
          <div className="pt-3 text-white">
            <Link to={`/product/${product._id}`}>
              <h2 className="text-base font-medium truncate w-56">
                {product.name}
              </h2>
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default React.memo(SmallProduct);
