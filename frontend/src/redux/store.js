import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice.js";
import authReducer from "./features/auth/authSlice.js";
import favoritesReducer from "../redux/features/favorites/favoriteSlice.js";
import { getFavoritesFromLocalStorage } from "../Utils/localStorage.js";
import cartSliceReducer from "../redux/features/cart/cartSlice.js";
import shopReducer from "../redux/features/shop/shopSlice.js";

const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },

  preloadedState: {
    favorites: initialFavorites,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false, // ⚡ disables deep-freeze check (big speed gain)
      serializableCheck: false, // ⚡ disables circular/complex object validation
    }).concat(apiSlice.middleware),

  devTools: process.env.NODE_ENV !== "production", // ✅ only in dev mode
});

setupListeners(store.dispatch);
export default store;
