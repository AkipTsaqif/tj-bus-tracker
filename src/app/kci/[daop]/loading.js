import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div>
            <Skeleton className="absolute left-6 top-12 text-white text-[10px] font-wayfinding" />
            <div className="flex justify-between items-center mx-6 my-4">
                <Skeleton className="text-white text-[20px] font-wayfinding font-bold" />
                <Skeleton className="text-white font-wayfinding font-bold text-center text-[28px]" />
                <Skeleton className="uppercase tracking-wide bg-wayout hover:bg-wayout font-wayfinding text-black font-bold border-white border-[1px]" />
            </div>
            <div className="mx-6">
                <Skeleton className="w-11/12 h-5/6" />
            </div>
        </div>
    );
};

export default Loading;
