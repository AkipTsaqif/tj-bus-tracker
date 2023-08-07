import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getCurrentCity = createAsyncThunk(
    "user-location/current-city",
    async (coords) => {
        const location = await axios.get(
            `${process.env.NEXT_PUBLIC_GEOAPI_URL}?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=id-ID`
        );

        return location.data.address;
    }
);

export const setClosestLandmark = createAsyncThunk(
    "user-location/closest-landmark",
    async (landmark) => {
        return landmark;
    }
);

const locationSlice = createSlice({
    name: "user-location",
    initialState: {
        currentCity: {},
        closestLandmark: {},
    },
    reducers: {},
    extraReducers: {
        [getCurrentCity.fulfilled]: (state, action) => {
            state.currentCity = action.payload;
        },
        [setClosestLandmark.fulfilled]: (state, action) => {
            state.closestLandmark = action.payload;
        },
    },
});

export const selectUserLocation = ({ locationSlice }) => locationSlice;

export default locationSlice.reducer;
