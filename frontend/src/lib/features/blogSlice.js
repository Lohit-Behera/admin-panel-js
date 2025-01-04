import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

export const fetchCreateBlog = createAsyncThunk(
  "blog/createBlog",
  async (
    blog,
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/blogs/create`,
        blog,
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

export const fetchGetBlog = createAsyncThunk(
  "blog/getBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/blogs/${blogId}`);
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

export const fetchGetAllBlogs = createAsyncThunk(
  "blog/getAllBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/blogs/get/all`);
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

export const fetchUpdateBlog = createAsyncThunk(
  "blog/updateBlog",
  async (
    updatedBlog,
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/blogs/update/${updatedBlog._id}`,
        updatedBlog,
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

export const blogSlice = createSlice({
  name: "blog",
  initialState: {
    createBlog: { data: "" },
    createBlogStatus: "idle",
    createBlogError: {},

    getBlog: { data: {} },
    getBlogStatus: "idle",
    getBlogError: {},

    getAllBlogs: { data: [] },
    getAllBlogsStatus: "idle",
    getAllBlogsError: {},

    getRecentBlogs: { data: [] },
    getRecentBlogsStatus: "idle",
    getRecentBlogsError: {},

    updateBlog: { data: "" },
    updateBlogStatus: "idle",
    updateBlogError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Blog
      .addCase(fetchCreateBlog.pending, (state) => {
        state.createBlogStatus = "loading";
      })
      .addCase(fetchCreateBlog.fulfilled, (state, action) => {
        state.createBlogStatus = "succeeded";
        state.createBlog.data = action.payload;
      })
      .addCase(fetchCreateBlog.rejected, (state, action) => {
        state.createBlogStatus = "failed";
        state.createBlogError = action.payload || "Failed to create blog";
      })
      // Get Blog
      .addCase(fetchGetBlog.pending, (state) => {
        state.getBlogStatus = "loading";
      })
      .addCase(fetchGetBlog.fulfilled, (state, action) => {
        state.getBlogStatus = "succeeded";
        state.getBlog = action.payload;
      })
      .addCase(fetchGetBlog.rejected, (state, action) => {
        state.getBlogStatus = "failed";
        state.getBlogError = action.payload || "Failed to get blog";
      })

      // Get All Blogs
      .addCase(fetchGetAllBlogs.pending, (state) => {
        state.getAllBlogsStatus = "loading";
      })
      .addCase(fetchGetAllBlogs.fulfilled, (state, action) => {
        state.getAllBlogsStatus = "succeeded";
        state.getAllBlogs = action.payload;
      })
      .addCase(fetchGetAllBlogs.rejected, (state, action) => {
        state.getAllBlogsStatus = "failed";
        state.getAllBlogsError = action.payload || "Failed to get all blogs";
      })

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
        state.getRecentBlogsError =
          action.payload || "Failed to get recent blogs";
      })

      // Update Blog
      .addCase(fetchUpdateBlog.pending, (state) => {
        state.updateBlogStatus = "loading";
      })
      .addCase(fetchUpdateBlog.fulfilled, (state, action) => {
        state.updateBlogStatus = "succeeded";
        state.updateBlog = action.payload;
      })
      .addCase(fetchUpdateBlog.rejected, (state, action) => {
        state.updateBlogStatus = "failed";
        state.updateBlogError = action.payload || "Failed to update blog";
      });
  },
});

export default blogSlice.reducer;
