import Image from "next/image";
import TanjungPriok from "../../public/line-icons/Tanjungpriok_Icon.svg";
import Bogor from "../../public/line-icons/Bogor_Icon.svg";
import Cikarang from "../../public/line-icons/Cikarang_Icon.svg";
import Rangkasbitung from "../../public/line-icons/Rangkasbitung_Icon.svg";
import Tangerang from "../../public/line-icons/Tangerang_Icon.svg";

const LineIcon = ({ line, noka }) => {
    if (
        line.toLowerCase() === "tanjungpriuk" ||
        (line.toLowerCase() === "jakartakota" && Math.floor(noka / 1000) === 2)
    ) {
        return (
            <Image
                className="border-2 border-white rounded-full"
                src={TanjungPriok}
                alt="Lin Tanjungpriuk"
                width={24}
                height={24}
            />
        );
    }

    if (line.toLowerCase() === "tangerang" || line.toLowerCase() === "duri") {
        return (
            <Image
                className="border-2 border-white rounded-full"
                src={Tangerang}
                alt="Lin Tangerang"
                width={24}
                height={24}
            />
        );
    }

    if (
        line.toLowerCase() === "kampungbandan" ||
        line.toLowerCase() === "angke" ||
        line.toLowerCase() === "bekasi" ||
        line.toLowerCase() === "cikarang" ||
        line.toLowerCase() === "manggarai"
    ) {
        return (
            <Image
                className="border-2 border-white rounded-full"
                src={Cikarang}
                alt="Lin Cikarang"
                width={24}
                height={24}
            />
        );
    }

    if (
        line.toLowerCase() === "tanahabang" ||
        line.toLowerCase() === "serpong" ||
        line.toLowerCase() === "parungpanjang" ||
        line.toLowerCase() === "tigaraksa" ||
        line.toLowerCase() === "rangkasbitung"
    ) {
        return (
            <Image
                className="border-2 border-white rounded-full"
                src={Rangkasbitung}
                alt="Lin Rangkasbitung"
                width={24}
                height={24}
            />
        );
    }

    if (
        line.toLowerCase() === "jakartakota" ||
        line.toLowerCase() === "bogor" ||
        line.toLowerCase() === "nambo" ||
        line.toLowerCase() === "depok"
    ) {
        return (
            <Image
                className="border-2 border-white rounded-full"
                src={Bogor}
                alt="Lin Bogor"
                width={24}
                height={24}
            />
        );
    }

    return <div></div>;
};

export default LineIcon;
