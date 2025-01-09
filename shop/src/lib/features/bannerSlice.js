import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

export const fetchGetBanners = createAsyncThunk(
    "banner/getBanners",
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/banners/get`);
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

const bannerSlice = createSlice({
    name: "banner",
    initialState: {
        getBanners: { data: [] },
        getBannersStatus: "idle",
        getBannersError: {},
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchGetBanners.pending, (state) => {
            state.getBannersStatus = "loading";
          })
          .addCase(fetchGetBanners.fulfilled, (state, action) => {
            state.getBannersStatus = "succeeded";
            state.getBanners = action.payload;
          })
          .addCase(fetchGetBanners.rejected, (state, action) => {
            state.getBannersStatus = "failed";
            state.getBannersError = action.payload || "Failed to get banners";
          })
    }
});

export default bannerSlice.reducer;