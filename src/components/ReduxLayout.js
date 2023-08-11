"use client";

import { Provider } from "react-redux";
import Navbar from "./Navbar";
import store from "@/store";
import Footer from "./Footer";

const ReduxLayout = ({ children }) => {
    return (
        <Provider store={store}>
            <div className="min-h-screen">
                <Navbar />
                <div className="mb-[42px]">{children}</div>
                <Footer />
            </div>
        </Provider>
    );
};

export default ReduxLayout;
