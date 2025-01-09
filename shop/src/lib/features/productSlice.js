import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

export const fetchGetRecentProducts = createAsyncThunk(
    "product/getRecentProducts",
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/products/get/recent`);
        return data;
      } catch (error) {
        const errorMessage =
          error.response && error.response.data
            ? error.response.data.message
            : error.message;
        return rejectWithValue(errorMessage);
      }
    }
  );

// slice
const productSlice = createSlice({
    name: "product",
    initialState: {
        getRecentProducts: { data: [] },
        getRecentProductsStatus: "idle",
        getRecentProductsError: {},
    },
    extraReducers: (builder) => {
      builder
        // Get Recent Products
      .addCase(fetchGetRecentProducts.pending, (state) => {
        state.getRecentProductsStatus = "loading";
      })
      .addCase(fetchGetRecentProducts.fulfilled, (state, action) => {
        state.getRecentProductsStatus = "succeeded";
        state.getRecentProducts = action.payload;
      })
      .addCase(fetchGetRecentProducts.rejected, (state, action) => {
        state.getRecentProductsStatus = "failed";
        state.getRecentProductsError =
          action.payload || "Failed to get recent products";
      })
    },
  });

  export default productSlice.reducer;