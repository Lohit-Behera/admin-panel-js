import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

// fetch functions
export const fetchGetCount = createAsyncThunk(
  "base/getCount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/base/get/count`);
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
const baseSlice = createSlice({
  name: "base",
  initialState: {
    getCount: {},
    getCountStatus: "idle",
    getCountError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get count
      .addCase(fetchGetCount.pending, (state) => {
        state.getCountStatus = "loading";
      })
      .addCase(fetchGetCount.fulfilled, (state, action) => {
        state.getCountStatus = "succeeded";
        state.getCount = action.payload;
      })
      .addCase(fetchGetCount.rejected, (state, action) => {
        state.getCountStatus = "failed";
        state.getCountError = action.payload || "Failed to get count";
      });
  },
});

export default baseSlice.reducer;
