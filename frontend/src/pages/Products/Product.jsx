import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-[20rem] ml-8 p-3 relative duration-300 ease-in-out cursor-pointer">
      <div className="relative hover:scale-105 transition-transform ease-in-out">
        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-[16rem] h-60 object-cover rounded"
        />

        {/* Heart icon */}
        <HeartIcon product={product} />

        {/* Price tag inside image (bottom-left corner) */}
        <div className="absolute bottom-2 left-2 bg-pink-600 bg-opacity-90 text-white text-sm font-semibold px-2.5 py-1 rounded-full shadow-md">
          {product?.price?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
        </div>
      </div>

      {/* Product name below image */}
      <div className="pt-3 text-white">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-medium truncate w-[16rem]">
            {product.name}
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(Product);
