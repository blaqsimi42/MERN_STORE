import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("Paystack");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
     e.preventDefault()

     dispatch(saveShippingAddress({address, city, postalCode, country}))
     dispatch(savePaymentMethod(paymentMethod))
     navigate("/placeorder"); 
  }

  // ✅ Load existing address into form fields
  useEffect(() => {
    if (shippingAddress) {
      setAddress(shippingAddress.address || "");
      setCity(shippingAddress.city || "");
      setPostalCode(shippingAddress.postalCode || "");
      setCountry(shippingAddress.country || "");
    }
  }, [shippingAddress]);

  // ✅ Auto-save on any field change
  useEffect(() => {
    if (address || city || postalCode || country) {
      dispatch(
        saveShippingAddress({
          address,
          city,
          postalCode,
          country,
        })
      );
    }
  }, [address, city, postalCode, country, dispatch]);

  // ✅ Optional: Prevent accessing if no saved address
  useEffect(() => {
    if (!shippingAddress?.address) {
      console.log("No saved shipping address yet");
    }
  }, [navigate, shippingAddress]);

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
    dispatch(savePaymentMethod(method));
  };

  return (
    <div className="container mx-auto mt-10">
      <ProgressSteps step1 step2/>
      <div className="mt-16 flex justify-around items-center flex-wrap">
        <form
        onSubmit={submitHandler}
        className="w-160 p-14 border border-gray-800 rounded-2xl">
          <h1 className="text-2xl font-semibold mb-4 text-pink-500">
            Shipping
          </h1>
<div className=""></div>
          {/* Address */}
          <div className="mb-4">
            <label className="block text-white mb-2">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* City */}
          <div className="mb-4">
            <label className="block text-white mb-2">City</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Postal Code */}
          <div className="mb-4">
            <label className="block text-white mb-2">Postal Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="block text-white mb-2">Country</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-black text-white"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* ✅ Payment Method with Radio Buttons */}
          <div className="mb-6">
            <label className="block text-white mb-2 font-semibold">
              Payment Method
            </label>
            <div className="space-y-3">
              {["Paystack", "PayPal", "Stripe"].map((method) => (
                <label
                  key={method}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => handlePaymentChange(method)}
                    className="w-5 h-5 accent-pink-500"
                  />
                  <span className="text-white">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full text-lg w-full transition-all duration-200"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
