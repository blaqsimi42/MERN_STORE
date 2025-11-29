import React from "react";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import { LoaderCircle } from "lucide-react"; // ✅ Added Lucide Loader

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center mt-[8rem] ml-[2rem] md:ml-[6rem] text-white">
        <LoaderCircle className="animate-spin text-pink-500 w-10 h-10 mb-3" />
        <p className="text-gray-300 text-lg">Loading top products...</p>
      </div>
    );

  if (error)
    return (
      <h1 className="text-red-500 grid justify-center">
        Error loading top products!
      </h1>
    );

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 overflow-x-hidden">
        {/* ===== Carousel Section ===== */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-start">
          <div className="w-full max-w-[90vw] lg:max-w-none overflow-hidden">
            <ProductCarousel products={data} />
          </div>
        </div>

        {/* ===== Small Products Grid ===== */}
        <div className="w-full flex justify-center lg:w-auto md:ml-[0] ml-[6rem]">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 justify-items-center">
            {data?.map((product) => (
              <SmallProduct key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Header);
