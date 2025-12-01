import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaUserAlt } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message.jsx";
import AdminMenu from "./AdminMenu.jsx";
import { CgUser } from "react-icons/cg";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error.data?.message || error.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      toast.success("User updated successfully");
      setEditableUserId(null);
      refetch();
    } catch (error) {
      toast.error(error.data?.message || error.error);
    }
  };

  return (
    <div className="p-4 lg:ml-16">
      <AdminMenu />
      <h1 className="text-2xl font-semibold mb-8 flex items-center justify-center text-white">
        <CgUser size={26} className="mr-2" />
        Users ({users?.length || 0})
      </h1>

      {isLoading ? (
        <div className="flex justify-center mt-48">
          <Loader />
        </div>
      ) : error ? (
        <div className="flex justify-center p-2">
          <Message variant="danger">
            {error?.data?.message || error?.error || "Something went wrong"}
          </Message>
        </div>
      ) : (
        <>
          {/* ✅ Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-[#101011] border border-gray-800 rounded-lg text-white">
              <thead>
                <tr className="bg-[#18181b] border-b border-gray-700">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">NAME</th>
                  <th className="px-4 py-3 text-left">EMAIL</th>
                  <th className="px-4 py-3 text-left">ADMIN</th>
                  <th className="px-4 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700 hover:bg-[#1f1f23] transition-colors"
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <FaUserAlt />
                      {user._id}
                    </td>

                    <td className="px-4 py-3">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) =>
                              setEditableUserName(e.target.value)
                            }
                            className="w-full p-2 border rounded-lg bg-black text-white"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.username}
                          <FaEdit
                            className="ml-3 cursor-pointer hover:text-blue-400"
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                          />
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) =>
                              setEditableUserEmail(e.target.value)
                            }
                            className="w-full p-2 border rounded-lg bg-black text-white"
                          />
                          <button
                            className="ml-2 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600"
                            onClick={() => updateHandler(user._id)}
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.email}
                          <FaEdit
                            className="ml-3 cursor-pointer hover:text-blue-400"
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                          />
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile / Tablet Card Layout */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-1 gap-4">
            {users?.map((user) => (
              <div
                key={user._id}
                className="bg-[#101011] text-white border border-gray-700 rounded-xl p-4 shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FaUserAlt className="text-gray-400" />
                  <p className="truncate text-sm">{user._id}</p>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-semibold">Name:</p>
                  {editableUserId === user._id ? (
                    <input
                      type="text"
                      value={editableUserName}
                      onChange={(e) => setEditableUserName(e.target.value)}
                      className="w-full p-2 bg-black rounded-lg text-white"
                    />
                  ) : (
                    <p>{user.username}</p>
                  )}
                </div>

                <div className="mb-2">
                  <p className="text-sm font-semibold">Email:</p>
                  {editableUserId === user._id ? (
                    <input
                      type="text"
                      value={editableUserEmail}
                      onChange={(e) => setEditableUserEmail(e.target.value)}
                      className="w-full p-2 bg-black rounded-lg text-white"
                    />
                  ) : (
                    <p>{user.email}</p>
                  )}
                </div>

                <div className="mb-2 flex items-center">
                  <p className="text-sm font-semibold mr-2">Admin:</p>
                  {user.isAdmin ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-3">
                  {editableUserId === user._id ? (
                    <button
                      onClick={() => updateHandler(user._id)}
                      className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600"
                    >
                      <FaCheck />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          toggleEdit(user._id, user.username, user.email)
                        }
                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg"
                      >
                        <FaEdit />
                      </button>
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
