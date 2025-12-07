import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice.js";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice.js";
import { Loader2 } from "lucide-react";
import ProductCard from "./Products/ProductCard.jsx";
import Message from "../components/Message.jsx";
import { CgShoppingBag } from "react-icons/cg";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio, isLoading, error } =
    useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });
  const [priceFilter, setPriceFilter] = useState("");

  useEffect(() => {
    if (!categoriesQuery.isLoading && Array.isArray(categoriesQuery.data)) {
      dispatch(setCategories(categoriesQuery.data.filter((c) => c && c._id)));
    }
  }, [categoriesQuery.data, dispatch, categoriesQuery.isLoading]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      const filteredProducts = filteredProductsQuery.data.filter((product) => {
        if (!product) return false;
        const matchesPrice =
          product.price?.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10);
        return matchesPrice;
      });

      dispatch(setProducts(filteredProducts));
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    dispatch,
    priceFilter,
    filteredProductsQuery.isLoading,
  ]);

  const uniqueBrands = useMemo(() => {
    const filteredByCategory = filteredProductsQuery.data?.filter((product) =>
      checked.length === 0 ? true : checked.includes(product?.category)
    );

    return [
      ...new Set(
        filteredByCategory
          ?.map((product) => product?.brand)
          .filter((brand) => !!brand)
      ),
    ];
  }, [checked, filteredProductsQuery.data]);

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handleBrandClick = (brand) => {
    const productByBrand = filteredProductsQuery.data?.filter(
      (product) => product?.brand === brand
    );
    dispatch(setProducts(productByBrand));
  };

  const handlePriceChange = (e) => setPriceFilter(e.target.value);

  if (categoriesQuery.isLoading || filteredProductsQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <h1 className="font-semibold flex items-center gap-2 mb-6">
          <CgShoppingBag size={26} className="text-pink-400" />
          <span>Shop</span>
        </h1>
        <Loader2 className="animate-spin text-pink-500" size={36} />
        <p className="mt-2 text-gray-400 text-sm">Loading products...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-3 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FILTERS SECTION */}
        <div className="flex flex-col lg:flex-row lg:ml-20">
          <div className="bg-[#151515] p-3 mt-2 mb-2 rounded-lg shadow-md w-full max-w-full lg:max-w-[30rem]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div className="p-3 sm:p-5">
                <h2 className="h4 p-2 text-center py-2 bg-black rounded-full mb-2 text-pink-500 font-semibold">
                  Filter Categories
                </h2>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((c) =>
                    c?._id ? (
                      <div key={c._id} className="mb-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${c._id}`}
                            onChange={(e) =>
                              handleCheck(e.target.checked, c._id)
                            }
                            className="bg-gray-800 border w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                          />
                          <label
                            htmlFor={`category-${c._id}`}
                            className="ml-2 text-sm font-medium text-white"
                          >
                            {c.name}
                          </label>
                        </div>
                      </div>
                    ) : null
                  )
                ) : (
                  <p className="text-gray-400 text-sm">No categories found</p>
                )}
              </div>

              {/* Brand Filter */}
              <div className="p-3 sm:p-5">
                <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-pink-500 font-semibold">
                  Filter By Brands
                </h2>
                {uniqueBrands?.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    No brands available for this category
                  </p>
                ) : (
                  uniqueBrands.map((brand) => (
                    <div
                      key={brand}
                      className="flex items-center mb-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        id={brand}
                        name="brand"
                        onChange={() => handleBrandClick(brand)}
                        className="bg-gray-800 border w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <label
                        htmlFor={brand}
                        className="ml-2 text-sm font-medium text-white"
                      >
                        {brand}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Price Filter */}
            <div className="p-3 sm:p-5">
              <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-pink-500 font-semibold">
                Filter by Price
              </h2>
              <input
                type="number"
                value={priceFilter}
                onChange={handlePriceChange}
                placeholder="Enter price..."
                className="w-full p-2 rounded-lg bg-black text-white border border-gray-700 focus:border-pink-600 focus:ring focus:ring-pink-700/50"
              />
              <div className="p-4 pt-0 flex justify-center">
                <button
                  className="w-[8rem] border hover:border-pink-500 hover:rounded my-4 text-white"
                  onClick={() => window.location.reload()}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS SECTION */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[20rem]">
            <Loader2 className="animate-spin text-pink-500" size={32} />
            <p className="mt-2 text-gray-400 text-sm">Loading products...</p>
          </div>
        ) : error ? (
          <div className="w-full flex justify-center p-2">
            <Message variant="danger">
              {error?.data?.message || error?.error || "Something went wrong"}
            </Message>
          </div>
        ) : (
          <div className="p-3">
            <h2 className="h4 text-center mb-2 text-white">
              {products?.length} Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-[5rem] ml-[4rem] md:ml-[7rem] lg:ml-[10rem]">
                  <Loader2
                    className="animate-spin text-pink-500 mb-2"
                    size={32}
                  />
                  <p className="text-gray-400 text-sm">Fetching items...</p>
                </div>
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
