export const formatCurrency = (amount) => {
  const formatted = (Number(amount) || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
  return formatted.startsWith("₦")
    ? formatted
    : `₦${(Number(amount) || 0).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
};
