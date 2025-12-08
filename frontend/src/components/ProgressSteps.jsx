import React from "react";

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      {/* Step 1 */}
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 ${
            step1
              ? "border-white bg-green-500 text-white shadow-[0_0_10px_#22c55e]"
              : "border-white bg-transparent text-gray-400"
          }`}
        >
          1
        </div>
        <span
          className={`mt-2 text-sm font-medium ${
            step1 ? "text-green-400" : "text-gray-400"
          }`}
        >
          Login
        </span>
      </div>

      {/* Connector */}
      <div
        className={`h-1 w-20 rounded-full transition-all duration-500 ${
          step2 ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-gray-700"
        }`}
      ></div>

      {/* Step 2 */}
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 ${
            step2
              ? "border-white bg-green-500 text-white shadow-[0_0_10px_#22c55e]"
              : "border-white bg-transparent text-gray-400"
          }`}
        >
          2
        </div>
        <span
          className={`mt-2 text-sm font-medium ${
            step2 ? "text-green-400" : "text-gray-400"
          }`}
        >
          Shipping
        </span>
      </div>

      {/* Connector */}
      <div
        className={`h-1 w-20 rounded-full transition-all duration-500 ${
          step3 ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-gray-700"
        }`}
      ></div>

      {/* Step 3 */}
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 ${
            step3
              ? "border-white bg-green-500 text-white shadow-[0_0_10px_#22c55e]"
              : "border-white bg-transparent text-gray-400"
          }`}
        >
          3
        </div>
        <span
          className={`mt-2 text-sm font-medium ${
            step3 ? "text-green-400" : "text-gray-400"
          }`}
        >
          Summary
        </span>
      </div>
    </div>
  );
};

export default ProgressSteps;
