import { combineReducers, configureStore } from "@reduxjs/toolkit";
import krlSlice from "./slices/krlSlice";
import locationSlice from "./slices/locationSlice";
import landmarksSlice from "./slices/landmarksSlice";

const allReducers = combineReducers({
    krlSlice,
    locationSlice,
    landmarksSlice,
});

const store = configureStore({
    reducer: allReducers,
});

export default store;
