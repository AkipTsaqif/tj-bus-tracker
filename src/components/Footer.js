import Link from "next/link";

const Footer = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 px-6 border-t-2 border-white min-h-[36px] flex bg-waybase">
            <div className="flex items-center justify-between w-screen font-bold">
                <span className="text-white font-wayfinding text-sm">{`Transum App - © ${new Date().getFullYear()} - Akip`}</span>
                <Link
                    href="/changelog"
                    className="text-white font-wayfinding text-sm"
                >
                    Changelog
                </Link>
            </div>
        </div>
    );
};

export default Footer;
