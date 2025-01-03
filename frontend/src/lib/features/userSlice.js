import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";
import { getCookie } from "../getCookie";

export const fetchLogin = createAsyncThunk(
  "user/login",
  async (user, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseUrl}/api/v1/users/login`, user);
      document.cookie = `userInfoCanvas=${encodeURIComponent(
        JSON.stringify(data.data)
      )}; path=/; max-age=${1 * 24 * 60 * 60}; secure; sameSite=None;`;
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

const userInfoCookie = getCookie("userInfoCanvas");

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: userInfoCookie ? JSON.parse(userInfoCookie) : null,
    userInfoStatus: "idle",
    userInfoError: {},
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.userInfoStatus = "idle";
      state.userInfoError = {};
      document.cookie =
        "userInfoCanvas=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.userInfoStatus = "loading";
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.userInfoStatus = "succeeded";
        state.userInfo = action.payload.data;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.userInfoStatus = "failed";
        state.userInfoError = action.payload || "Login failed";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
