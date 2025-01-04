import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import baseSlice from "./features/baseSlice";
import categorySlice from "./features/categorySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      base: baseSlice,
      category: categorySlice,
    },
  });
};