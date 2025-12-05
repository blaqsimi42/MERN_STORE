import React from "react";
import AdminMenu from "./AdminMenu";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice.js";
import Loader from "../../components/Loader.jsx";
import { Link } from "react-router";
import Message from "../../components/Message.jsx";
import { CgViewList } from "react-icons/cg";
import  { formatCurrency }  from "../../Utils/formatCurrency.js";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  return (
    <div className="container mx-auto ml-[1rem] md:ml-[2rem] py-6  min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Section */}
        <div className="flex-1 ml-[0rem] md:ml-[0rem]">
          <div className="ml-[0.6rem] md:ml-[4rem] flex items-center gap-2 mb-6">
            <CgViewList size={28} />
            <h2 className="text-2xl font-bold text-white">
              All Products{" "}
              <span className=" text-lg">({products?.length || 0})</span>
            </h2>
          </div>

          {/* Loader / Error / Products */}
          {isLoading ? (
            <div className="flex ml-64 justify-center items-center h-48 mt-32">
              <Loader />
            </div>
          ) : isError ? (
            <div className="grid justify-center items-center ml-64 mt-24">
              <Message variant="danger">
                {isError?.data?.message || "Something went wrong!"}
              </Message>
            </div>
          ) : (
            <div className="ml-[1.6rem] lg:ml-[0rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3  lg:w-[70rem] md:w-[50rem] ">
              {products?.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  className="group bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-md hover:shadow-pink-700/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 w-[90%] sm:w-[85%]"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-all duration-300"
                    />
                    {/* ✅ Use formatter for Naira price display */}
                    <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-3 py-1 rounded-full shadow-md font-medium">
                      {formatCurrency(product.price)}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2 h-4">
                      <h5 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                        {product.name}
                      </h5>
                      <p className="text-gray-400 text-xs">
                        {moment(product.createdAt).format("MMM Do, YYYY")}
                      </p>
                    </div>

                    <p className="text-sm text-gray-400 mb-4">
                      {product.description?.substring(0, 80)}...
                    </p>

                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition duration-200"
                    >
                      Update Product
                      <svg
                        className="w-4 h-4 ml-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </Link>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:w-1/4 mt-4">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
