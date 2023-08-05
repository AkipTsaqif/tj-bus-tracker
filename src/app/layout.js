"use client";

import Navbar from "@/components/Navbar";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/store";

export const metadata = {
    title: "Tracking Posisi Transjakarta",
    description: "Tracking posisi beberapa operator bus Transjakarta (beta)",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-waybase">
                <Provider store={store}>
                    <Navbar />
                    {children}
                </Provider>
            </body>
        </html>
    );
}
