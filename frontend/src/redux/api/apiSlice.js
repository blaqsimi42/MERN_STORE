import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants.js";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // ✅ Add Authorization token automatically (if exists)
    const token = getState()?.auth?.userInfo?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api", // ✅ ensures proper state isolation
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category"],

  // ✅ These default behaviors help performance
  keepUnusedDataFor: 60, // Cache results for 1 minute
  refetchOnMountOrArgChange: false, // Don’t re-fetch on every remount
  refetchOnReconnect: true, // Re-fetch only if connection drops and reconnects
  refetchOnFocus: false, // Don’t auto-refetch when switching browser tabs

  endpoints: () => ({}),
});
