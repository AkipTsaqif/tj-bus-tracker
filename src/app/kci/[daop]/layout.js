export async function generateMetadata({ params }) {
    return {
        title: `Jadwal KRL KCI Daop ${params.daop} - Transum App`,
        description: `Cek jadwal KRL untuk wilayah Daop ${params.daop}, ${
            params.daop === 1 ? "Jakarta Raya" : "Yogya - Solo"
        } - Transum App`,
    };
}

export default function KCILayout({ children }) {
    return <div>{children}</div>;
}
