import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getStations = createAsyncThunk("landmarks/stations", async () => {
    const stations = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kci/stations`
    );

    return stations.data;
});

const landmarksSlice = createSlice({
    name: "landmarks",
    initialState: {
        stations: [],
        busStations: [],
    },
    reducers: {},
    extraReducers: {
        [getStations.fulfilled]: (state, action) => {
            state.stations = action.payload;
        },
    },
});

export const selectLandmarks = ({ landmarksSlice }) => landmarksSlice;

export default landmarksSlice.reducer;
