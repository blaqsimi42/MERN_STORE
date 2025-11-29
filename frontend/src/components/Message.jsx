import React from "react";

const Message = ({ variant = "info", children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-500 text-green-800";
      case "error":
      case "danger": // support both
        return "bg-red-200 text-red-800";
      case "info":
      default:
        return "bg-blue-200 text-blue-800";
    }
  };

  return (
    <div className={`p-4 rounded ${getVariantClass()}`}>
      {children}
    </div>
  );
};

export default Message;

