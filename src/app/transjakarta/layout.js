import "../globals.css";

export const metadata = {
    title: "Tracking Posisi Transjakarta",
    description: "Tracking posisi beberapa operator bus Transjakarta (beta)",
};

export default function Layout({ children }) {
    return (
        <html lang="en">
            <body className="bg-waybase">{children}</body>
        </html>
    );
}
