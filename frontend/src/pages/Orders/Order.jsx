import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { PaystackButton } from "react-paystack";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { Loader2 } from "lucide-react";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [delivered, setDelivered] = useState(false);

  const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const paystackConfig = useMemo(
    () => ({
      reference: new Date().getTime().toString(),
      email: userInfo?.email || "noemail@example.com",
      amount: Math.round(order?.totalPrice * 100) || 0,
      publicKey: PAYSTACK_PUBLIC_KEY,
      currency: "NGN",
      metadata: {
        orderId,
        userId: userInfo?._id,
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: userInfo?.username,
          },
        ],
      },
    }),
    [order, userInfo]
  );

  const handlePaystackSuccess = async (reference) => {
    toast.info("Verifying payment...");
    try {
      await payOrder({ orderId, details: { reference: reference.reference } });
      toast.success("Payment verified successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Payment verification failed");
    }
  };

  const handlePaystackClose = () => toast.info("Payment cancelled");

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      toast.success("Order marked as delivered");
      setDelivered(true);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to mark as delivered");
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <Loader2 className="animate-spin text-pink-500 mb-2" size={40} />
        <p className="text-gray-400 text-sm">Fetching order details...</p>
      </div>
    );

  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Error loading order"}
      </Message>
    );

  return (
    <div className="container mx-auto mt-10 px-4 sm:px-6 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {/* 🛍️ Order Items */}
        <div className="md:col-span-2 bg-[#121212] border border-gray-800 rounded-2xl p-4 sm:p-6 md:ml-[4rem] shadow-lg overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-semibold text-pink-500 mb-4 sm:mb-6">
            Order Items
          </h2>

          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-xs sm:text-sm md:text-base">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="py-3 text-left">Image</th>
                    <th className="py-3 text-left">Product</th>
                    <th className="py-3 text-center">Qty</th>
                    <th className="py-3 text-center">Unit</th>
                    <th className="py-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-800 hover:bg-[#1b1b1b] transition"
                    >
                      <td className="py-3 flex justify-center sm:justify-start">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover"
                        />
                      </td>
                      <td className="py-3">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-pink-400 hover:underline text-xs sm:text-sm"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="text-center py-3 text-gray-300">
                        {item.qty}
                      </td>
                      <td className="text-center py-3 text-gray-300">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="text-center py-3 text-gray-300 font-medium">
                        {formatCurrency(item.qty * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 📦 Shipping + Summary */}
        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-pink-500 mb-4 sm:mb-6 text-center">
            Shipping & Summary
          </h2>

          <div className="space-y-2 mb-6 text-sm text-gray-300">
            <p>
              <strong className="text-pink-500">Order ID:</strong> {order._id}
            </p>
            <p>
              <strong className="text-pink-500">Name:</strong>{" "}
              {order.user.username}
            </p>
            <p>
              <strong className="text-pink-500">Email:</strong>{" "}
              {order.user.email}
            </p>
            <p>
              <strong className="text-pink-500">Address:</strong>{" "}
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
            <p>
              <strong className="text-pink-500">Method:</strong>{" "}
              {order.paymentMethod}
            </p>

            {order.isPaid ? (
              <Message variant="success">
                <p className="text-gray-100 font-bold">
                  Paid on {order.paidAt}
                </p>
              </Message>
            ) : (
              <Message variant="danger">Not paid</Message>
            )}
          </div>

          {/* 🧾 Order Summary */}
          <div className="">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
              Order Summary
            </h3>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span>Items</span>
                <span className="text-white">
                  {formatCurrency(order.itemsPrice)}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span>Shipping</span>
                <span className="text-white">
                  {formatCurrency(order.shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span>Tax</span>
                <span className="text-white">
                  {formatCurrency(order.taxPrice)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-white text-base sm:text-lg pt-2">
                <span>Total</span>
                <span className="text-pink-400">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* 💳 Paystack Button */}
          {!order.isPaid && (
            <div className="mt-4">
              {loadingPay ? (
                <div className="flex justify-center items-center py-3">
                  <Loader2 className="animate-spin text-pink-500" size={24} />
                  <p className="ml-2 text-gray-400 text-sm">Processing...</p>
                </div>
              ) : (
                <PaystackButton
                  className="w-full bg-green-600 text-white py-2 sm:py-3 rounded hover:bg-green-700 transition-all duration-300"
                  {...paystackConfig}
                  text={`Pay ${formatCurrency(order.totalPrice)} with Paystack`}
                  onSuccess={handlePaystackSuccess}
                  onClose={handlePaystackClose}
                />
              )}
            </div>
          )}

          {/* ✅ Admin Delivery Button */}
          {loadingDeliver && (
            <div className="flex justify-center items-center py-3">
              <Loader2 className="animate-spin text-pink-500" size={24} />
              <p className="ml-2 text-gray-400 text-sm">Updating delivery...</p>
            </div>
          )}

          {userInfo && userInfo.isAdmin && order.isPaid && (
            <div className="mt-3">
              <button
                type="button"
                onClick={deliverHandler}
                disabled={order.isDelivered || delivered || loadingDeliver}
                className={`w-full py-2 sm:py-3 rounded-full font-bold transition ${
                  order.isDelivered || delivered
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                {order.isDelivered || delivered
                  ? "Delivered ✅"
                  : "Mark As Delivered"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
