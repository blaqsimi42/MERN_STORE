import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import AdminMenu from "./AdminMenu";

const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(params._id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  const [UploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setStock(productData.countInStock || "");
      setImage(productData.image || "");
    }
  }, [productData]);

  useEffect(() => {
    if (!category && categories?.length) {
      setCategory(categories[0]._id);
    }
  }, [categories, category]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await UploadProductImage(formData).unwrap();
      toast.success("Image upload successful");
      setImage(res.image);
    } catch {
      toast.error("Image not uploaded");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!category) {
      toast.error("Please select a category before updating the product.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const { data } = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.name} successfully updated`);
        navigate("/admin/allproductslist");
      }
    } catch {
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this Product?"
      );

      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`${data.name} is deleted`);
      navigate("/admin/allproductslist");
    } catch {
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <div className="container text-white">
      <div className="ml-[0rem] md:ml-[12rem]">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />

          <div className="md:w-3/4 p-30rem ml-0 md:ml-28 lg:ml-32">
            <div className="text-center text-2xl font-semibold mb-4">
              Update Product
            </div>

            {image && (
              <div className="text-center mb-3">
                <img
                  src={image}
                  alt="Product"
                  className="mx-auto max-h-[180px]"
                />
              </div>
            )}

            {/* Upload */}
            <div className="mb-4">
              <label className="border px-4 w-full text-center rounded-lg cursor-pointer font-bold py-8 block">
                {image ? image.name : "Upload Image"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className={!image ? "hidden" : "text-white"}
                />
              </label>
            </div>

            {/* Inputs */}
            <div className="p-3 space-y-4">
              {/* Responsive Grid (1 col on mobile, 1 on md, 2 on lg) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    className="p-3 mt-1 w-full border rounded-lg bg-[#101011]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Price */}
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    className="p-3 mt-1 w-full border rounded-lg bg-[#101011]"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label>Quantity</label>
                  <input
                    type="number"
                    className="p-3 mt-1 w-full border rounded-lg bg-[#101011]"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                {/* Brand */}
                <div>
                  <label>Brand</label>
                  <input
                    type="text"
                    className="p-3 mt-1 w-full border rounded-lg bg-[#101011]"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                {/* Count in stock */}
                <div>
                  <label>Count In Stock</label>
                  <input
                    type="text"
                    className="p-3 mt-1 w-full border rounded-lg bg-[#101011]"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                {/* Category */}
                <div>
                  <label>Category</label>
                  <select
                    className="p-3 mt-1 w-full border rounded-lg bg-[#101011]"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description full width */}
              <div>
                <label>Description</label>
                <textarea
                  className="p-3 mt-1 bg-[#101011] border rounded-lg w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="flex gap-6 pt-2">
                <button
                  onClick={handleUpdate}
                  className="py-3 px-8 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700"
                >
                  Update
                </button>

                <button
                  onClick={handleDelete}
                  className="py-3 px-8 rounded-lg text-lg font-bold bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
