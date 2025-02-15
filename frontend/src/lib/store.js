import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import baseSlice from "./features/baseSlice";
import categorySlice from "./features/categorySlice";
import productSlice from "./features/productSlice";
import blogSlice from "./features/blogSlice";
import bannerSlice from "./features/bannerSlice";
import collaborationSlice from "./features/collaborationSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      base: baseSlice,
      category: categorySlice,
      product: productSlice,
      blog: blogSlice,
      banner: bannerSlice,
      collaboration: collaborationSlice,
    },
  });
};