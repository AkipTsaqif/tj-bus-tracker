const Timeline = ({ data }) => {
    return (
        <div className="flex flex-col font-wayfinding text-white font-bold w-full h-full">
            {data.map((item) => (
                <div key={item.id} className="flex items-center h-[36px]">
                    <div className="relative h-full">
                        <div class="absolute w-1 h-1/2 bg-slate-500 dark:bg-slate-200 top-0 left-2.5"></div>
                        <div class="absolute w-4 h-4 bg-slate-500 dark:bg-slate-200 left-1 rounded-full top-1/2 -translate-y-1/2 border-2 border-white dark:border-gray-800 z-10"></div>
                        <div class="absolute w-1 h-1/2 bg-slate-500 dark:bg-slate-200 bottom-0 left-2.5"></div>
                    </div>
                    <div className="flex gap-2 ml-8">
                        <span>{item.time}</span>
                        <span className="capitalize">
                            {item.station.toLowerCase()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
