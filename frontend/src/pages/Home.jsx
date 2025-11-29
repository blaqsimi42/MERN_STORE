import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import { Loader2 } from "lucide-react";
import Header from "../components/Header";
import Message from "../components/Message";
import Product from "./Products/Product";
import { CgHome, CgShoppingBag } from "react-icons/cg";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery(keyword || "");

  // ✅ Memoize product list to prevent unnecessary re-renders
  const productList = React.useMemo(() => {
    return data?.products?.map((product) => (
      <div key={product._id}>
        <Product product={product} />
      </div>
    ));
  }, [data]);

  return (
    <>
      <div className="lg:ml-[16rem] flex sm:justify-center">
        {/* <h1 className="font-semibold text-2xl sm:text-3xl mb-3 text-white">
          Top Products
        </h1> */}
      </div>

      {!keyword && <Header />}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
          <h1 className="font-semibold flex items-center gap-2 mb-4">
            <CgHome size={24} className="text-pink-400" />
            Home
          </h1>
          <Loader2 className="animate-spin text-pink-500" size={40} />
          <p className="mt-3 text-gray-400 text-sm">Loading products...</p>
        </div>
      ) : isError ? (
        <div className="w-full flex justify-center p-2">
          <Message variant="danger">
            {isError?.data?.message || isError?.error || "Something went wrong"}
          </Message>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center sm:mt-[5rem] mt-8 sm:mx-[14rem] mx-[4rem]">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-0 text-white">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 hover:bg-pink-800 text-white font-bold rounded-full py-2 px-6 sm:px-10 flex items-center gap-2"
            >
              Shop Now <CgShoppingBag size={22} />
            </Link>
          </div>

          <div className="flex justify-center flex-wrap gap-6 mt-8 px-4">
            {productList}
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(Home);
