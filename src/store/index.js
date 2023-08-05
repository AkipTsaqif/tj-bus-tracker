import { combineReducers, configureStore } from "@reduxjs/toolkit";
import krlSlice from "./slices/krlSlice";

const allReducers = combineReducers({
    krlSlice,
});

const store = configureStore({
    reducer: allReducers,
});

export default store;
