import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

// api call
export const fetchCreateCategory = createAsyncThunk(
  "category/createCategory",
  async (
    category,
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/categories/create`,
        category,
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

export const fetchGetAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/categories/get/all`,
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

export const fetchGetAllCategoriesNames = createAsyncThunk(
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

export const fetchGetCategory = createAsyncThunk(
  "category/getCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/categories/get/${categoryId}`,
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

export const fetchUpdateCategory = createAsyncThunk(
  "category/updateCategory",
  async (
    category,
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/categories/update/${category._id}`,
        category,
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

export const fetchDeleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/categories/delete/${categoryId}`,
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

const categorySlice = createSlice({
  name: "category",
  initialState: {
    createCategory: {},
    createCategoryStatus: "idle",
    createCategoryError: {},

    getAllCategories: { data: []},
    getAllCategoriesStatus: "idle",
    getAllCategoriesError: {},

    getAllCategoriesNames: { data: [] },
    getAllCategoriesNamesStatus: "idle",
    getAllCategoriesNamesError: {},

    getCategory: { data: {} },
    getCategoryStatus: "idle",
    getCategoryError: {},

    updateCategory: { data: "" },
    updateCategoryStatus: "idle",
    updateCategoryError: {},

    deleteCategory: { data: "" },
    deleteCategoryStatus: "idle",
    deleteCategoryError: {},
  },
  reducers: {
    resetDeleteCategory: (state) => {
      state.deleteCategory = { data: "" };
      state.deleteCategoryStatus = "idle";
      state.deleteCategoryError = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // create category
      .addCase(fetchCreateCategory.pending, (state) => {
        state.createCategoryStatus = "loading";
      })
      .addCase(fetchCreateCategory.fulfilled, (state, action) => {
        state.createCategoryStatus = "succeeded";
        state.createCategory = action.payload;
      })
      .addCase(fetchCreateCategory.rejected, (state, action) => {
        state.createCategoryStatus = "failed";
        state.createCategoryError =
          action.payload || "Failed to create category";
      })
      // get all categories
      .addCase(fetchGetAllCategories.pending, (state) => {
        state.getAllCategoriesStatus = "loading";
      })
      .addCase(fetchGetAllCategories.fulfilled, (state, action) => {
        state.getAllCategoriesStatus = "succeeded";
        state.getAllCategories = action.payload;
      })
      .addCase(fetchGetAllCategories.rejected, (state, action) => {
        state.getAllCategoriesStatus = "failed";
        state.getAllCategoriesError =
          action.payload || "Failed to get categories";
      })

      // get all categories names
      .addCase(fetchGetAllCategoriesNames.pending, (state) => {
        state.getAllCategoriesNamesStatus = "loading";
      })
      .addCase(fetchGetAllCategoriesNames.fulfilled, (state, action) => {
        state.getAllCategoriesNamesStatus = "succeeded";
        state.getAllCategoriesNames = action.payload;
      })
      .addCase(fetchGetAllCategoriesNames.rejected, (state, action) => {
        state.getAllCategoriesNamesStatus = "failed";
        state.getAllCategoriesNamesError =
          action.payload || "Failed to get categories names";
      })

      // get category
      .addCase(fetchGetCategory.pending, (state) => {
        state.getCategoryStatus = "loading";
      })
      .addCase(fetchGetCategory.fulfilled, (state, action) => {
        state.getCategoryStatus = "succeeded";
        state.getCategory = action.payload;
      })
      .addCase(fetchGetCategory.rejected, (state, action) => {
        state.getCategoryStatus = "failed";
        state.getCategoryError = action.payload || "Failed to get category";
      })

      // update category
      .addCase(fetchUpdateCategory.pending, (state) => {
        state.updateCategoryStatus = "loading";
      })
      .addCase(fetchUpdateCategory.fulfilled, (state, action) => {
        state.updateCategoryStatus = "succeeded";
        state.updateCategory = action.payload;
      })
      .addCase(fetchUpdateCategory.rejected, (state, action) => {
        state.updateCategoryStatus = "failed";
        state.updateCategoryError =
          action.payload || "Failed to update category";
      })

      // delete category
      .addCase(fetchDeleteCategory.pending, (state) => {
        state.deleteCategoryStatus = "loading";
      })
      .addCase(fetchDeleteCategory.fulfilled, (state, action) => {
        state.deleteCategoryStatus = "succeeded";
        state.deleteCategory = action.payload;
      })
      .addCase(fetchDeleteCategory.rejected, (state, action) => {
        state.deleteCategoryStatus = "failed";
        state.deleteCategoryError =
          action.payload || "Failed to delete category";
      });
  },
});

export const { resetDeleteCategory } = categorySlice.actions;
export default categorySlice.reducer;
