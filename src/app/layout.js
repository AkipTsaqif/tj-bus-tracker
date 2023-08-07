import ReduxLayout from "@/components/ReduxLayout";
import "./globals.css";

export const metadata = {
    title: "Transum App",
    description: "Aplikasi pembantu dalam mengetahui posisi transum di Jakarta",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-waybase">
                <ReduxLayout>{children}</ReduxLayout>
            </body>
        </html>
    );
}
