import React from "react";
import { Link } from "react-router-dom";
import TopHeartIcon from "./TopHeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[16rem] p-3">
      <div className="relative hover:scale-105 duration-300 ease-in-out cursor-pointer">
        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="lg:h-[14rem] lg:w-[14rem] md:h-[14rem] md:w-[14rem] h-[8rem] w-[8rem] rounded object-cover"
        />

        {/* Heart icon */}
        <div className="">
         <TopHeartIcon product={product} /> 
        </div>
        

        {/* Price tag */}
        <div className="absolute left-2 bottom-[3rem] bg-pink-600 bg-opacity-90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
          {product?.price?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
        </div>

        {/* Product name */}
        <div className="pt-3 text-white">
          <Link to={`/product/${product._id}`}>
            <h2 className="text-base font-medium truncate w-[14rem]">
              {product.name}
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SmallProduct);
