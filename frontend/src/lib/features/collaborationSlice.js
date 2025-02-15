import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

// fetch functions
export const fetchAllCollaborations = createAsyncThunk(
    "collaboration/getAllCollaborations",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${baseUrl}/api/v1/collaborations/all`);
            return data;
        } catch (error) {
            const errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return rejectWithValue(errorMessage);
        }
    }
)

export const fetchDeleteCollaboration = createAsyncThunk(
    "collaboration/deleteCollaboration",
    async (collaborationId, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${baseUrl}/api/v1/collaborations/delete/${collaborationId}`);
            return data;
        } catch (error) {
            const errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return rejectWithValue(errorMessage);
        }
    }
)

const collaborationSlice = createSlice({
    name: "collaboration",
    initialState: {
        collaborations: {},
        collaborationsStatus: "idle",
        collaborationsError: {},

        deleteCollaboration: {},
        deleteCollaborationStatus: "idle",
        deleteCollaborationError: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get all collaborations
            .addCase(fetchAllCollaborations.pending, (state) => {
                state.collaborationsStatus = "loading";
            })
            .addCase(fetchAllCollaborations.fulfilled, (state, action) => {
                state.collaborationsStatus = "succeeded";
                state.collaborations = action.payload;
            })
            .addCase(fetchAllCollaborations.rejected, (state, action) => {
                state.collaborationsStatus = "failed";
                state.collaborationsError = action.payload || "Failed to get collaborations";
            })
            // delete collaboration
            .addCase(fetchDeleteCollaboration.pending, (state) => {
                state.deleteCollaborationStatus = "loading";
            })
            .addCase(fetchDeleteCollaboration.fulfilled, (state, action) => {
                state.deleteCollaborationStatus = "succeeded";
                state.deleteCollaboration = action.payload;
            })
            .addCase(fetchDeleteCollaboration.rejected, (state, action) => {
                state.deleteCollaborationStatus = "failed";
                state.deleteCollaborationError = action.payload || "Failed to delete collaboration";
            });
    },
});

export default collaborationSlice.reducer;