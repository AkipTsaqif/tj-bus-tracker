"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGeolocated } from "react-geolocated";
import axios from "axios";
import _ from "lodash";
import { ArrowUpDown, BusFront, TrainFront } from "lucide-react";

import Datatable from "@/components/Datatable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Clock from "react-live-clock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuTabs from "@/components/MenuTabs/MenuTabs";
import MenuContent from "@/components/MenuTabs/MenuContent";
import {
    getCurrentCity,
    selectUserLocation,
    setClosestLandmark,
} from "@/store/slices/locationSlice";
import { getStations, selectLandmarks } from "@/store/slices/landmarksSlice";
import { getKRLData, selectKRLData } from "@/store/slices/krlSlice";
import MovingChevrons from "@/components/MovingChevrons";
import LineIcon from "@/components/LineIcon";

export default function Home() {
    const [stationTimetable, setStationTimetable] = useState({});
    const [completeTimetable, setCompleteTimetable] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const { currentCity, closestLandmark } = useSelector(selectUserLocation);
    const { stations } = useSelector(selectLandmarks);
    const krlList = useSelector(selectKRLData);

    const menus = [
        {
            id: "kci",
            name: "KRL",
            icon: <TrainFront />,
        },
        {
            id: "kai",
            name: "Kereta Jarak Jauh",
            icon: <TrainFront />,
        },
        {
            id: "tj",
            name: "Transjakarta",
            icon: <BusFront />,
        },
    ];

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
                            <div className="w-1/4 flex text-waybase">-</div>
                            <span className="w-3/4">{`${
                                props.getValue().posisi
                            }`}</span>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: true,
            },
            userDecisionTimeout: 5000,
        });

    const getCurrentStationTimetable = async (currStation) => {
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

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const earthRadius = 6371;

        const degToRad = (degrees) => degrees * (Math.PI / 180);
        const dLat = degToRad(lat2 - lat1);
        const dLon = degToRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degToRad(lat1)) *
                Math.cos(degToRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = earthRadius * c;
        return distance;
    };

    const findClosestPoint = (myLat, myLon, stationCoordinates) => {
        let minDistance = Number.MAX_VALUE;
        let closestStation = null;

        for (const station of stationCoordinates) {
            const distance = calculateDistance(
                myLat,
                myLon,
                station.lat,
                station.lon
            );

            if (distance < minDistance) {
                minDistance = distance;
                closestStation = { name: station.name, code: station.code };
            }
        }

        return closestStation;
    };

    useEffect(() => {
        if (stations.length === 0) dispatch(getStations());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getKRLData("d1"));

        const interval = setInterval(() => {
            dispatch(getKRLData("d1"));
        }, 300000);

        return () => {
            clearInterval(interval);
        };
    }, [dispatch]);

    useEffect(() => {
        if (stations.length > 0) {
            const currLat = coords?.latitude;
            const currLon = coords?.longitude;
            const flattenedStations = _.flatMap(stations, (categoryObj) => {
                const category = categoryObj.category;
                const stations = categoryObj.stations;

                return _.map(stations, (station) => {
                    return { ...station, category };
                });
            });

            if (coords) {
                const closeStation = findClosestPoint(
                    currLat,
                    currLon,
                    flattenedStations
                );

                if (Object.keys(currentCity).length === 0)
                    dispatch(getCurrentCity(coords));

                if (Object.keys(closestLandmark).length === 0)
                    dispatch(setClosestLandmark(closeStation));
            }
        }
    }, [stations, coords, dispatch]);

    useEffect(() => {
        if (Object.keys(closestLandmark).length > 0) {
            setIsLoading(true);

            getCurrentStationTimetable(closestLandmark.code);
        }

        const interval = setInterval(() => {
            if (Object.keys(closestLandmark).length > 0) {
                setIsLoading(true);

                getCurrentStationTimetable(closestLandmark.code);
            }
        }, 60000);

        return () => {
            clearInterval(interval);
        };
    }, [closestLandmark]);

    useEffect(() => {
        if (
            Object.keys(stationTimetable).length > 0
            // && krlList.length > 0
        ) {
            setIsLoading(true);
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
        <div className="flex flex-col px-6 py-2 h-[calc(100vh-78px)]">
            <div className="flex justify-between items-center">
                <div className="grid grid-cols-5 w-1/2">
                    <span className="text-white font-bold font-wayfinding tracking-wide">
                        Lokasimu
                    </span>
                    <div className="flex col-span-4 text-white font-bold font-wayfinding tracking-wide">
                        :{" "}
                        {Object.keys(currentCity).length ? (
                            `${
                                currentCity.neighbourhood
                                    ? currentCity.neighbourhood
                                    : currentCity.village
                            }, ${currentCity.city_district}, ${
                                currentCity.city
                            }`
                        ) : (
                            <Skeleton className="ml-1 h-[90%] w-full bg-slate-500/50" />
                        )}
                    </div>
                    <span className="text-white font-bold font-wayfinding tracking-wide">
                        Stasiun terdekat
                    </span>
                    <div className="flex col-span-4 text-white font-bold font-wayfinding tracking-wide">
                        :{" "}
                        {Object.keys(closestLandmark).length ? (
                            `${closestLandmark.code} - ${closestLandmark.name}`
                        ) : (
                            <Skeleton className="ml-1 h-[90%] w-full bg-slate-500/50" />
                        )}
                    </div>
                </div>
                <div>
                    <Clock
                        className="text-white font-wayfinding font-bold text-center text-[26px]"
                        format={"HH:mm:ss"}
                        ticking={true}
                        timezone={"Asia/Jakarta"}
                    />
                </div>
            </div>
            <MenuTabs menus={menus}>
                <MenuContent content="kci">
                    <div className="flex flex-col gap-2 text-white font-bold font-wayfinding">
                        Kereta berikutnya:
                        <Datatable
                            data={completeTimetable}
                            columns={columns}
                            loading={isLoading}
                        />
                    </div>
                </MenuContent>
                <MenuContent content="kai">Dalam pengembangan</MenuContent>
                <MenuContent content="tj">Dalam pengembangan</MenuContent>
            </MenuTabs>
            {/* <div className="grid grid-cols-2 gap-4 w-full mt-2">
                <div className="text-white font-bold font-wayfinding">
                    Bus terdekat:
                    <Tabs
                        defaultValue="account"
                        className="w-[400px] border-2 border-white"
                    >
                        <TabsList className="w-full m-auto bg-waybase">
                            <TabsTrigger
                                className="w-full m-auto font-bold"
                                value="account"
                            >
                                Kereta
                            </TabsTrigger>
                            <TabsTrigger
                                className="w-full m-auto font-bold"
                                value="password"
                            >
                                Bus
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            Make changes to your account here.
                        </TabsContent>
                        <TabsContent value="password">
                            Change your password here.
                        </TabsContent>
                    </Tabs>
                </div>
            </div> */}
        </div>
    );
}
