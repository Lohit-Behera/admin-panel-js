import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

export const fetchGetCategories = createAsyncThunk(
    "category/getAllCategoriesNames",
    async (_, { rejectWithValue }) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.get(
          `${baseUrl}/api/v1/categories/get/names`,
          config
        );
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

const  categorySlice = createSlice({
    name: "category",
    initialState: {
      getCategories: { data: [] },
      getCategoriesStatus: "idle",
      getCategoriesError: {},
    },
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchGetCategories.pending, (state) => {
        state.getCategoriesStatus = "loading";
      })
      builder.addCase(fetchGetCategories.fulfilled, (state, action) => {
        state.getCategoriesStatus = "succeeded";
        state.getCategories = action.payload;
      })
      builder.addCase(fetchGetCategories.rejected, (state, action) => {
        state.getCategoriesStatus = "failed";
        state.getCategoriesError = action.payload || "Failed to get categories";
      })
    }
  })

  export default categorySlice.reducer