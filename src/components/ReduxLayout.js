"use client";

import { Provider } from "react-redux";
import Navbar from "./Navbar";
import store from "@/store";

const ReduxLayout = ({ children }) => {
    return (
        <Provider store={store}>
            <Navbar />
            {children}
        </Provider>
    );
};

export default ReduxLayout;
