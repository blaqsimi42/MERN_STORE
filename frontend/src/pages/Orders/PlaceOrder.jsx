import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ProgressSteps from "../../components/ProgressSteps";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (!cart.shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress, navigate]);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Order failed");
    }
  };

  return (
    <>
      <div>
        <ProgressSteps step1 step2 step3 />
      </div>

      <div className="container mx-auto mt-10 px-4 sm:px-6 pt-4">
        {cart.cartItems.length === 0 ? (
          <div className="flex justify-center px-4">
            <Message variant="success">
              <p className="text-white font-semibold text-center">
                Order placed successfully✅.
              </p>
            </Message>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {/* 🛍️ Cart Items */}
            <div className="md:col-span-2 bg-[#121212] rounded-2xl p-4 sm:p-6 md:ml-[4rem] shadow-lg border border-gray-800 overflow-hidden">
              <h2 className="text-xl sm:text-2xl font-semibold text-pink-500 mb-4 sm:mb-6">
                Review Your Items
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-xs sm:text-sm md:text-base">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="py-3 text-left">Image</th>
                      <th className="py-3 text-left">Product</th>
                      <th className="py-3 text-center">Qty</th>
                      <th className="py-3 text-center">Price</th>
                      <th className="py-3 text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.cartItems.map((item, index) => (
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
                            to={`/product/${item._id}`}
                            className="text-pink-400 hover:underline text-xs sm:text-sm"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="text-center py-3 text-gray-300">
                          {item.qty}
                        </td>
                        <td className="text-center py-3 text-gray-300">
                          {formatCurrency(item?.price)}
                        </td>
                        <td className="text-center py-3 text-gray-300 font-medium">
                          {formatCurrency(item.qty * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 📦 Order Summary */}
            <div className="bg-[#181818] rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-800 flex flex-col justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-pink-500 mb-4 sm:mb-6 text-center">
                Order Summary
              </h2>

              <ul className="space-y-3 sm:space-y-4 text-gray-300">
                <li className="flex justify-between border-b border-gray-700 pb-2 text-sm sm:text-base">
                  <span>Items Price:</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(cart?.itemsPrice)}
                  </span>
                </li>
                <li className="flex justify-between border-b border-gray-700 pb-2 text-sm sm:text-base">
                  <span>Shipping Fee:</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(cart?.shippingPrice)}
                  </span>
                </li>
                <li className="flex justify-between border-b border-gray-700 pb-2 text-sm sm:text-base">
                  <span>Tax:</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(cart?.taxPrice)}
                  </span>
                </li>
                <li className="flex justify-between text-base sm:text-lg font-bold text-white">
                  <span>Total:</span>
                  <span className="text-pink-400">
                    {formatCurrency(cart?.totalPrice)}
                  </span>
                </li>
              </ul>

              <div className="mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                  Shipping Details
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed break-words">
                  {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </div>

              <div className="mt-4 sm:mt-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                  Payment Method
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {cart.paymentMethod}
                </p>
              </div>

              <button
                type="button"
                className={`mt-6 sm:mt-8 w-full py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 ${
                  cart.cartItems.length === 0
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-pink-500 hover:bg-pink-600 text-white"
                }`}
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </button>

              {isLoading && (
                <div className="mt-4 flex justify-center">
                  <Loader />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;
