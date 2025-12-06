import React from "react";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { LoaderCircle } from "lucide-react"; 

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 xl:block lg:block md:block">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-24 text-white">
          <LoaderCircle className="animate-spin text-pink-500 w-12 h-12 mb-4" />
          <p className="text-gray-300 text-lg">Loading top products...</p>
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-136 lg:w-136  md:w-4xl sm:block"
        >
          {products?.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="relative">
                {/* Product Image */}
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-116"
                />

                {/* Overlay with product name and price */}
                <div className="h-116 absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent rounded-lg flex flex-col justify-end p-6">
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                    {name}
                  </h1>
                  <div className="w-36">
                    <p className="text-lg text-gray-200 mb-2 bg-pink-600 p-2 font-semibold rounded-2xl">
                      {price?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </p>
                  </div>

                  <h1 className="flex items-center w-60">
                    <FaClock className="mr-4 text-orange-400" /> Added:{" "}
                    {moment(createdAt).fromNow()}
                  </h1>
                </div>

                {/* Product details below the image */}
                <div className="grid grid-cols-2 bg-[#111]/80 text-white p-4 rounded-b-lg gap-4 md:gap-12">
                  <div className="one">
                    <p className="w-[8rem] h-[8rem] md:h-[4rem] md:w-[5rem] md:w-[17rem] flex flex-wrap mb-[1rem] md:mb-[0.6rem]">
                      {description.substring(0, 60)}...
                    </p>
                    <div className="mt-2 two">
                      <div className="flex items-center mb-3">
                        <FaStar className="mr-2 text-yellow-400" />
                        Ratings: {Math.round(rating)}
                      </div>
                      <h1 className="flex items-center mb-3">
                        <FaShoppingCart className="mr-2 text-green-400" />
                        Quantity: {quantity}
                      </h1>
                    </div>
                  </div>

                  <div className="ml-7">
                    <h1 className="flex items-center mb-3 w-60">
                      <FaStore className="mr-4 text-blue-400" /> Brand : {brand}
                    </h1>
                    <h1 className="flex items-center mb-3 w-60">
                      <FaStar className="mr-4 text-yellow-400" /> Reviews :{" "}
                      {numReviews}
                    </h1>
                    <h1 className="flex items-center mb-3 w-60">
                      <FaBox className="mr-2 text-purple-400" /> In Stock :{" "}
                      {countInStock}
                    </h1>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
