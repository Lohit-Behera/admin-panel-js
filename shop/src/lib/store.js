import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./features/categorySlice";
import productSlice from "./features/productSlice";
import blogSlice from "./features/blogSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      category: categorySlice,
      product: productSlice,
      blog: blogSlice
    },
  });
};