import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

export const fetchGetRecentBlogs = createAsyncThunk(
    "blog/getRecentBlogs",
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/blogs/get/recent`);
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

const blogSlice = createSlice({
    name: "blog",
    initialState: {
        getRecentBlogs: { data: [] },
        getRecentBlogsStatus: "idle",
        getRecentBlogsError: {},
    },
    extraReducers: (builder) => {
        builder
            // Get Recent Blogs
            .addCase(fetchGetRecentBlogs.pending, (state) => {
                state.getRecentBlogsStatus = "loading";
            })
            .addCase(fetchGetRecentBlogs.fulfilled, (state, action) => {
                state.getRecentBlogsStatus = "succeeded";
                state.getRecentBlogs = action.payload;
            })
            .addCase(fetchGetRecentBlogs.rejected, (state, action) => {
                state.getRecentBlogsStatus = "failed";
                state.getRecentBlogsError = action.payload || "Failed to get recent blogs";
            })
    }
});

export default blogSlice.reducer