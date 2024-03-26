"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, Check, ChevronRight, ChevronsUpDown } from "lucide-react";
import Clock from "react-live-clock";
import Datatable from "@/components/Datatable";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getKRLData, selectKRLData } from "@/store/slices/krlSlice";
import _ from "lodash";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { getStations, selectLandmarks } from "@/store/slices/landmarksSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import MovingChevrons from "@/components/MovingChevrons";
import LineIcon from "@/components/LineIcon";

const DaopStationTimetable = ({ params }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedStation, setSelectedStation] = useState("");
    const [stationTimetable, setStationTimetable] = useState([]);
    const [completeTimetable, setCompleteTimetable] = useState([]);

    const dispatch = useDispatch();
    const { stations } = useSelector(selectLandmarks);
    const krlList = useSelector(selectKRLData);

    const columns = [
        {
            accessorKey: "dest",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="tracking-wider text-white font-wayfinding font-bold hover:bg-waybase hover:text-white"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Tujuan
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: (props) => (
                <div className="font-bold flex items-center gap-2">
                    <LineIcon
                        line={props.getValue()}
                        noka={props.row.original.noka}
                    />
                    {props.getValue()}
                </div>
            ),
        },
        {
            accessorKey: "noka",
            header: "No. KA",
        },
        // {
        //     accessorKey: "ts",
        //     header: "TS",
        // },
        // {
        //     accessorKey: "trains",
        //     header: "TS",
        //     cell: (props) => (
        //         <div className="font-bold">
        //             {props.getValue().map((train) => (
        //                 <span key={train.train_no}>{train.train_no}</span>
        //             ))}
        //         </div>
        //     ),
        // },
        {
            accessorKey: "sf",
            header: "SF",
        },
        {
            accessorKey: "jadwal",
            header: "ETA",
        },
        {
            accessorKey: "posisi",
            header: ({ column }) => {
                return (
                    <div className="w-full h-full flex items-center">
                        <Button
                            variant="ghost"
                            className="w-1/2 m-auto tracking-wider text-white font-wayfinding font-bold hover:bg-waybase hover:text-white"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Posisi
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: (props) => (
                <div>
                    {props.getValue().hasOwnProperty("peron") ? (
                        <div className="flex w-full h-full items-center">
                            <div className="w-1/4 flex">
                                <MovingChevrons length={5} />
                            </div>
                            <span className="font-bold w-3/4">{`DI JALUR ${
                                props.getValue().peron
                            }`}</span>
                        </div>
                    ) : (
                        <div className="flex w-full h-full items-center">
                            <div className="w-1/4 flex text-waybase"></div>
                            <span className="w-3/4">{`${
                                props.getValue().posisi
                            }`}</span>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    const timeDifference = (departureTime) => {
        const [targetHour, targetMinute] = departureTime.split(":").map(Number);
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        let minuteDifference =
            (currentHour - targetHour) * 60 + (currentMinute - targetMinute);

        const isLater = minuteDifference > 0;

        if (isLater) {
            minuteDifference = Math.abs(minuteDifference);
        }

        const formattedDifference = (isLater ? "+" : "") + minuteDifference;

        return formattedDifference;
    };

    const fetchData = async (currStation) => {
        setIsLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/kci/station-timetable`,
                {
                    src: currStation,
                }
            )
            .then((res) => {
                const data = res.data?.data;

                const flattenedData = _.flatMap(
                    data,
                    ({ dest_station_name, trains }) =>
                        _.map(trains, (train) => ({
                            dest: dest_station_name,
                            noka: train.train_no,
                            jadwal: train.time,
                            sf: train.sf,
                            posisi: {
                                posisi: train.position.replace(
                                    "BERANGKAT",
                                    "BER"
                                ),
                                ...(train.time.includes("TIBA")
                                    ? { peron: train.track }
                                    : null),
                            },
                        }))
                );

                setStationTimetable(flattenedData);
            });
    };

    useEffect(() => {
        if (stations.length === 0) {
            dispatch(getStations());
        }

        if (krlList.length === 0) {
            dispatch(getKRLData("d1"));
        }

        const interval = setInterval(() => {
            dispatch(getKRLData("d1"));
        }, 300000);

        return () => {
            clearInterval(interval);
        };
    }, [dispatch]);

    useEffect(() => {
        if (selectedStation) {
            setCompleteTimetable([]);
            fetchData(selectedStation.code);

            const interval = setInterval(() => {
                fetchData(selectedStation.code);
            }, 60000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [selectedStation, krlList]);

    useEffect(() => {
        if (
            Object.keys(stationTimetable).length > 0
            // && krlList.length > 0
        ) {
            // const trainset = _.keyBy(krlList, "noka");
            const trainset = null;
            const mergedTrainset = stationTimetable.map((train) => {
                const noka = train.noka;
                const ts =
                    // trainset[noka]?.trainset ||
                    "Tidak diketahui";

                return _.merge({}, train, { ts });
            });

            setCompleteTimetable(mergedTrainset);
            setIsLoading(false);
        }
    }, [stationTimetable, krlList]);

    return (
        <div>
            {/* <div className="absolute left-6 top-12 text-white text-[10px] font-wayfinding">
                v1.2.6
            </div> */}
            <div className="flex justify-between items-center mx-6 my-4">
                <Popover
                    open={open}
                    onOpenChange={setOpen}
                    className="bg-waybase"
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between bg-waybase text-white font-wayfinding font-bold hover:bg-wayout hover:text-black border-2"
                        >
                            {selectedStation
                                ? selectedStation.name
                                : "Pilih stasiun..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command className="font-wayfinding font-bold">
                            <CommandInput placeholder="Cari stasiun..." />
                            <CommandEmpty>
                                Stasiun tidak ditemukan.
                            </CommandEmpty>
                            {stations.length === 0 ? (
                                <CommandItem>
                                    <span className="m-auto">
                                        Tidak ada data stasiun.
                                    </span>
                                </CommandItem>
                            ) : (
                                <ScrollArea className="h-[400px]">
                                    {stations.map((type) => (
                                        <CommandGroup
                                            key={type.category}
                                            heading={type.category}
                                        >
                                            {type.stations.map((station) => (
                                                <CommandItem
                                                    key={station.code}
                                                    onSelect={() => {
                                                        setSelectedStation(
                                                            _.isEqual(
                                                                station,
                                                                selectedStation
                                                            )
                                                                ? ""
                                                                : station
                                                        );
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            _.isEqual(
                                                                station,
                                                                selectedStation
                                                            )
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {station.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    ))}
                                </ScrollArea>
                            )}
                        </Command>
                    </PopoverContent>
                </Popover>

                <Clock
                    className="text-white font-wayfinding font-bold text-center text-[28px]"
                    format={"HH:mm:ss"}
                    ticking={true}
                    timezone={"Asia/Jakarta"}
                />
                <Button
                    className="uppercase tracking-wide bg-wayout hover:bg-wayout font-wayfinding text-black font-bold border-white border-[1px]"
                    onClick={() => fetchData()}
                    disabled={isLoading || !selectedStation}
                >
                    Refresh Data
                </Button>
            </div>
            <div className="mx-6">
                <Datatable
                    columns={columns}
                    data={completeTimetable}
                    loading={isLoading}
                    clickableRow={true}
                />
            </div>
        </div>
    );
};

export default DaopStationTimetable;
