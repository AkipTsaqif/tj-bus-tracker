import Link from "next/link";

const Footer = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 px-6 border-t-2 border-white min-h-[42px] flex bg-waybase">
            <div className="flex items-center justify-between w-screen">
                <span className="text-white font-wayfinding">{`© Akip - ${new Date().getFullYear()}`}</span>
                <Link href="/changelog" className="text-white font-wayfinding">
                    Changelog
                </Link>
            </div>
        </div>
    );
};

export default Footer;
