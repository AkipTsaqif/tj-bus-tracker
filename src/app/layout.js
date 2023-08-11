import ReduxLayout from "@/components/ReduxLayout";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Transum App",
    description: "Aplikasi pembantu dalam mengetahui posisi transum di Jakarta",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-waybase overflow-visible">
                <NextTopLoader color="#F9D437" showSpinner={false} />
                <ReduxLayout>{children}</ReduxLayout>
            </body>
        </html>
    );
}
