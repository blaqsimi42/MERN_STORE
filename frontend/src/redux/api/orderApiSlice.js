import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYSTACK_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🧩 Create a new order
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    // 📦 Get order details
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    // 💳 Mark order as paid
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    // 🔑 Get Paystack Public Key
    getPayStackClientId: builder.query({
      query: () => ({
        url: PAYSTACK_URL,
        method: "GET",
      }),
    }),

    // 👤 Get logged-in user's orders
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/my-orders`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      refetchOnMountOrArgChange: true,
    }),

    // 🧾 Get all orders (Admin)
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      refetchOnMountOrArgChange: true,
    }),

    // 🚚 Mark order as delivered (Admin)
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/delivered`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"], // ensures UI refreshes after delivery
    }),

    // 📊 Count total orders
    getTotalOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-orders`,
        method: "GET",
      }),
    }),

    // 💰 Calculate total sales
    getTotalSales: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-sales`,
        method: "GET",
      }),
    }),

    // 📅 Sales by date
    getTotalSalesByDate: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-sales-by-date`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayStackClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
} = orderApiSlice;
