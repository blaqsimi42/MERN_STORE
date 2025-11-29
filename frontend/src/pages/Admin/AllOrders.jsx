import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const AllOrders = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  return (
    <div className="md:ml-[5rem] ml-[0rem] pr-6 py-4">
      <AdminMenu />
      <h2 className="text-2xl font-semibold mb-8 text-gray-200">All Orders ({orders.length})</h2>

      {orders?.length === 0 ? (
        <Message>No orders found</Message>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2rem] ml-[2.6rem]">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#1e1e1e] border border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-[19rem]"
            >
              {/* 🖼 Image */}
              <div className="w-full h-[8rem] overflow-hidden">
                <img
                  src={order.orderItems[0]?.image}
                  alt={order._id}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* 📋 Order Info */}
              <div className="p-3 flex flex-col gap-2">
                <div>
                  <p className="text-gray-400 text-xs">
                    <strong className="text-pink-500">Order ID:</strong>{" "}
                    {order._id.substring(0, 10)}...
                  </p>
                  <p className="text-gray-400 text-xs">
                    <strong className="text-pink-500">User:</strong>{" "}
                    {order.user ? order.user.username : "N/A"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    <strong className="text-pink-500">Date:</strong>{" "}
                    {order.createdAt?.substring(0, 10) || "N/A"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    <strong className="text-pink-500">Total:</strong> ₦
                    {order.totalPrice.toFixed(2)}
                  </p>
                </div>

                {/* ✅ Statuses */}
                <div className="flex justify-between items-center text-xs mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      order.isPaid ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      order.isDelivered ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </span>
                </div>

                {/* 🔘 Action */}
                <Link to={`/order/${order._id}`}>
                  <button className="w-full mt-3 bg-pink-500 hover:bg-pink-600 text-white py-1.5 rounded-md text-sm font-medium transition-all duration-300">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
