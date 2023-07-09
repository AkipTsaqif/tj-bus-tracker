import "./globals.css";

export const metadata = {
    title: "Tracking Posisi Transjakarta",
    description: "Tracking posisi beberapa operator bus Transjakarta (beta)",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
