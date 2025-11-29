import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice.js";

import CategoryForm from "../../components/CategoryForm.jsx";
import Modal from "../../components/Modal.jsx";
import AdminMenu from "./AdminMenu.jsx";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";
import { CgListTree } from "react-icons/cg";

const CategoryList = () => {
  const { data: categories, isLoading, error } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setselectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} category was created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if(!updatingName) {
      toast.error('Category name is required');
      return;
    }

    try {
      const result = await updateCategory({categoryId: selectedCategory._id, updatedCategory: {
        name: updatingName
      }}).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} has been successfully updated`);
      
        setselectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }

    } catch (error) {
      console.error(error)
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(`${result.name} has been deleted.`);
          setselectedCategory(null);
          setModalVisible(false);

        }

    } catch (error) {
      console.error(error);
      toast.error('Category deletion failed. Try again.')
    }
  }

  return (
    <>
      <div className="lg:ml-[10rem] ml-[1rem] flex flex-col md:flex-row">
         <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-2xl font-semibold flex gap-2"><CgListTree /> Categories</div>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />
          <br />
          <hr />

        {isLoading ? (
                <div className="flex justify-center mt-4">
                  <Loader />
                </div>
              ) : error ? (
                <Message variant="danger">
                  {error?.data?.message || error?.error || "Something went wrong"}
                </Message>
              ) : (

          <div className="flex flex-wrap">
            {categories?.map((category) => (
              <div key={category._id}>
                <button
                  className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-600 hover:text-white
                focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50
                "
                  onClick={() => {
                    {
                      setModalVisible(true);
                      setselectedCategory(category);
                      setUpdatingName(category.name);
                    }
                  }}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>

              )}
              

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <CategoryForm 
              value={updatingName} 
              setValue={(value) => setUpdatingName(value)}
              handleSubmit={ handleUpdateCategory }
              buttonText="Update"
              handleDelete={ handleDeleteCategory }
                />
              </Modal>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
