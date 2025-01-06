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

export const fetchDeleteBanner = createAsyncThunk(
    "banner/deleteBanner",
    async (bannerId, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(
                `${baseUrl}/api/v1/banners/delete/${bannerId}`
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

        getBanner: {data: []},
        getBannerStatus: "idle",
        getBannerError: {},

        deleteBanner: {},
        deleteBannerStatus: "idle",
        deleteBannerError: {},
    },
    reducers: {
        resetDeleteBanner: (state) => {
            state.deleteBanner = {};
            state.deleteBannerStatus = "idle";
            state.deleteBannerError = {};
        }
    },
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
            // delete Banner
            .addCase(fetchDeleteBanner.pending, (state) => {
                state.deleteBannerStatus = "loading";
            })
            .addCase(fetchDeleteBanner.fulfilled, (state, action) => {
                state.deleteBannerStatus = "succeeded";
                state.deleteBanner = action.payload;
            })
            .addCase(fetchDeleteBanner.rejected, (state, action) => {
                state.deleteBannerStatus = "failed";
                state.deleteBannerError = action.payload;
            });
    },
});

export const { resetDeleteBanner } = bannerSlice.actions;
export default bannerSlice.reducer;