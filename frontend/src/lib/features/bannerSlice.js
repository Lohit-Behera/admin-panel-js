import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

export const fetchCreateBanner = createAsyncThunk(
    "banner/createBanner",
    async (banner, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            const { data } = await axios.post(
                `${baseUrl}/api/v1/banners/create`,
                banner,
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

export const fetchGetBanner = createAsyncThunk(
    "banner/getBanner",
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

export const fetchUpdateBanner = createAsyncThunk(
    "banner/updateBanner",
    async (banner, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            const { data } = await axios.put(
                `${baseUrl}/api/v1/banners/update`,
                banner,
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

const bannerSlice = createSlice({
    name: "banner",
    initialState: {
        createBanner: {},
        createBannerStatus: "idle",
        createBannerError: {},

        getBanner: {},
        getBannerStatus: "idle",
        getBannerError: {},

        updateBanner: {},
        updateBannerStatus: "idle",
        updateBannerError: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        // Create Banner
            .addCase(fetchCreateBanner.pending, (state) => {
                state.createBannerStatus = "loading";
            })
            .addCase(fetchCreateBanner.fulfilled, (state, action) => {
                state.createBannerStatus = "succeeded";
                state.createBanner = action.payload;
            })
            .addCase(fetchCreateBanner.rejected, (state, action) => {
                state.createBannerStatus = "failed";
                state.createBannerError = action.payload;
            })
            // Get Banner
            .addCase(fetchGetBanner.pending, (state) => {
                state.getBannerStatus = "loading";
            })
            .addCase(fetchGetBanner.fulfilled, (state, action) => {
                state.getBannerStatus = "succeeded";
                state.getBanner = action.payload;
            })            
            .addCase(fetchGetBanner.rejected, (state, action) => {
                state.getBannerStatus = "failed";
                state.getBannerError = action.payload;
            })
            // Update Banner
            .addCase(fetchUpdateBanner.pending, (state) => {
                state.updateBannerStatus = "loading";
            })
            .addCase(fetchUpdateBanner.fulfilled, (state, action) => {
                state.updateBannerStatus = "succeeded";
                state.updateBanner = action.payload;
            })
            .addCase(fetchUpdateBanner.rejected, (state, action) => {
                state.updateBannerStatus = "failed";
                state.updateBannerError = action.payload;
            });
    },
});

export default bannerSlice.reducer;