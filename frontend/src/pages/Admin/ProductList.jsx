import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice.js";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice.js";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu.jsx";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  // ✅ Auto-select first category when categories are fetched
  useEffect(() => {
    if (categories?.length && !category) {
      setCategory(categories[0]._id);
    }
  }, [categories, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      toast.error("Please select a category before creating the product.");
      return;
    }

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data?.error) {
        toast.error("Product create failed. Try again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container">
      <div className="h-[50%] xl:ml-[9rem] md:ml-[13rem] sm:mx-[0]">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />

          <div className="md:w-3/4 p-3">
            <div className="h-8 mb-1 font-semibold text-2xl text-white">
              Create Product
            </div>

            {imageUrl && (
              <div className="text-center">
                <img
                  src={imageUrl}
                  alt="Product image"
                  className="block mx-auto max-h-[200px]"
                />
              </div>
            )}

            <div className="mb-2 mt-2">
              <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                {image ? image.name : "Upload Image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className={!image ? "hidden" : "text-white"}
                />
              </label>
            </div>

            {/* ✅ Responsive grid for inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 p-3 text-white">
              {/* Name */}
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* Brand */}
              <div>
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              {/* Count In Stock */}
              <div>
                <label htmlFor="stock">Count In Stock</label>
                <input
                  type="text"
                  className="p-4 mb-1 w-full border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category">Category</label>
                <select
                  className="p-4 mb-1 w-full border rounded-lg bg-[#101011] text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>
                    {categories?.length ? "Select Category" : "Loading..."}
                  </option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="p-3 text-white">
              <label htmlFor="description" className="my-5">
                Description
              </label>
              <textarea
                placeholder="Input Description here ...."
                className="p-2 mb-3 bg-[#101011] border rounded-lg w-full text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button
              onClick={handleSubmit}
              className="py-4 px-10 mt-3 rounded-lg text-lg font-bold bg-pink-600 cursor-pointer hover:bg-pink-700"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
