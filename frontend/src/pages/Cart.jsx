import React from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { formatCurrency } from "../Utils/formatCurrency.js";
import { toast } from "react-toastify";
import { useResendVerificationOtpMutation } from "../redux/api/usersApiSlice.js";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  const [resendVerificationOtp, { isLoading: isResending }] =
    useResendVerificationOtpMutation();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // 🔴 Handle send verification OTP
  const handleSendVerificationOtp = async () => {
    if (!userInfo?.email) {
      toast.error("You must be logged in to verify your account.");
      return;
    }

    try {
      toast.info("You must verify your account before checking out!");
      const res = await resendVerificationOtp({
        email: userInfo.email,
      }).unwrap();
      toast.success(res.message || "Verification OTP sent to your email.");
      navigate("/verify-otp");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send verification OTP.");
    }
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate("/login?redirect=/shipping");
      return;
    }

    if (!userInfo.isVerified) {
      handleSendVerificationOtp();
      return;
    }

    navigate("/shipping");
  };

  return (
    <>
      {/* Title */}
      <div className="lg mt-[3rem] sm:ml-[13rem] ml-4">
        <p className="uppercase font-bold text-lg text-white">
          Shopping Cart ({cartItems.length})
        </p>
      </div>

      {/* Main Container */}
      <div className="container flex justify-around items-start flex-wrap mx-auto mt-8 px-3">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center mt-[10rem] gap-2 text-center">
            <FaSearch size={24} className="text-pink-400" />
            <p className="font-semibold text-white">Your Cart is empty</p>
            <Link to="/shop" className="text-pink-500 hover:underline">
              Get items to your Cart
            </Link>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="flex flex-col w-[80%] md:w-[90%] ">
              <div
                className="
                  grid 
                  grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                  gap-6
                  justify-items-center
                "
              >
                {cartItems?.map((item) => (
                  <div
                    key={item._id}
                    className="
                      flex flex-col items-center text-center 
                      bg-[#1a1a1a] rounded-lg p-3
                      hover:scale-[1.02] transition-transform
                      w-full max-w-[14rem]
                    "
                  >
                    {/* Image */}
                    <div className="w-full h-[8rem] sm:h-[9rem] md:h-[10rem] overflow-hidden rounded">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="mt-3">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-pink-500 font-semibold hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-300 text-sm mt-1">{item.brand}</p>
                      <p className="text-white font-bold mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    {/* Qty + Delete */}
                    <div className="flex items-center justify-between w-full mt-3">
                      <select
                        className="w-[4rem] p-1 border rounded text-white bg-black"
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>

                      <button
                        className="text-red-500 hover:text-red-400"
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Section */}
              <div className="mt-8 sm:w-[50rem] w-full ml-[0rem] lg:ml-[1rem]">
                <div className="p-4 rounded-lg grid sm:grid-cols-3 grid-cols-1 gap-4 bg-[#1a1a1a]">
                  <h2 className="text-xl font-semibold text-white">
                    Total Items (
                    {cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}
                    )
                  </h2>

                  <div className="text-2xl font-bold text-white">
                    Total:{" "}
                    {formatCurrency(
                      cartItems.reduce(
                        (acc, item) => acc + item.qty * item.price,
                        0
                      )
                    )}
                  </div>

                  <button
                    className="bg-pink-500 py-2 px-4 rounded text-lg font-bold w-full hover:bg-pink-700 transition"
                    disabled={cartItems.length === 0 || isResending}
                    onClick={checkoutHandler}
                  >
                    {userInfo && !userInfo.isVerified
                      ? isResending
                        ? "Sending OTP..."
                        : "Verify Account"
                      : "Proceed To Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
