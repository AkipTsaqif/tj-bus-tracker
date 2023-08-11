"use client";

import { Provider } from "react-redux";
import Navbar from "./Navbar";
import store from "@/store";
import Footer from "./Footer";

const ReduxLayout = ({ children }) => {
    return (
        <Provider store={store}>
            <div className="h-screen">
                <Navbar />
                <div className="h-[calc(100vh-78px)] overflow-y-auto">
                    {children}
                </div>
                <Footer />
            </div>
        </Provider>
    );
};

export default ReduxLayout;
