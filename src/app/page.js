import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-48px)]">
            <h2 className="scroll-m-20 border-b text-white pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Ini tampilan menu utama. Masih dalam progress.
            </h2>
            <Button className="mt-4 uppercase tracking-wide bg-waybase font-wayfinding text-white font-bold border-white border-[1px]">
                Klik di sini untuk membuka peta Transjakarta
            </Button>
        </div>
    );
}
