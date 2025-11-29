export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // ✅ Calculate items total
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // ✅ Shipping: Free for orders above ₦100, else ₦10 (change as needed)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  // ✅ VAT (Paystack standard 7.5%)
  const vatRate = 0.085;
  state.taxPrice = addDecimals(state.itemsPrice * vatRate);

  // ✅ Grand total (matches Paystack total)
  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice)
  );

  // ✅ Persist to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
