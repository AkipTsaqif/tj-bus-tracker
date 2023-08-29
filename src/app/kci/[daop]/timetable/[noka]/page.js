import { redirect } from "next/navigation";
import axios from "axios";
import Timeline from "@/components/Timeline";
import store from "@/store";
import { getStations } from "@/store/slices/landmarksSlice";
import Map from "@/components/Map";

const getTrainTimetable = async (noka) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kci/train-timetable`,
        {
            train_no: noka.toString(),
        }
    );

    store.dispatch(getStations());

    return res.data;
};

const TrainTimetable = async ({ params }) => {
    // if (!trainData) redirect(`/kci/${params.daop}/stations`);
    const timetable = await getTrainTimetable(params.noka);
    const { data } = timetable;
    const { stations } = store.getState().landmarksSlice;
    const flattenedStations = _.flatMap(stations, (categoryObj) => {
        const category = categoryObj.category;
        const stations = categoryObj.stations;

        return _.map(stations, (station) => {
            return { ...station, category };
        });
    });

    return (
        <div className="flex flex-col gap-4 mx-6 my-4">
            <h1 className="text-white text-[20px] font-wayfinding font-bold w-1/2">
                Jadwal KA
            </h1>
            {!Array.isArray(data) ? (
                <span className="text-white font-wayfinding">
                    Jadwal untuk perjalanan KA {params.noka} tidak ditemukan!
                </span>
            ) : (
                <div className="flex gap-4">
                    <div className="flex flex-col gap-4 font-wayfinding text-white w-1/4 overflow-y-hidden">
                        <div className="flex flex-col">
                            <div>
                                <span className="w-1/4 inline-block">
                                    Nomor
                                </span>
                                <span className="inline-block">
                                    : {params.noka}
                                </span>
                            </div>
                            <div>
                                <span className="w-1/4 inline-block">
                                    Rangkaian
                                </span>
                                <span className="inline-block">: -</span>
                            </div>
                            <div>
                                <span className="w-1/4 inline-block">
                                    Relasi
                                </span>
                                <span className="inline-block">
                                    :{" "}
                                    {`${data[0].station} - ${
                                        data[data.length - 1].station
                                    }`}
                                </span>
                            </div>
                            <div>
                                <span className="w-1/4 inline-block">
                                    Status
                                </span>
                                <span className="inline-block">: Status</span>
                            </div>
                        </div>
                        <div className="overflow-auto h-[calc(100vh-268px)]">
                            <Timeline data={data} />
                        </div>
                    </div>
                    <div className="w-3/4 h-[calc(100vh-156px)]">
                        <Map />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainTimetable;
