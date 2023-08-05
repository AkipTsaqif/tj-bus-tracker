"use client";

import Datatable from "@/components/Datatable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";

export default function Home() {
    const [stations, setStations] = useState([]);
    const [closestStation, setClosestStation] = useState({});
    const [currentCity, setCurrentCity] = useState({});

    const columns = [
        {
            accessorKey: "noka",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="tracking-wider text-white font-wayfinding font-bold hover:bg-waybase hover:text-white"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        No. KA
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "route_name",
            header: "Relasi",
        },
        {
            accessorKey: "trainset",
            header: "TS",
        },
        {
            accessorKey: "sf",
            header: "SF",
        },
    ];

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: true,
            },
            userDecisionTimeout: 5000,
        });

    const getStations = async () => {
        await axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}kci/stations`)
            .then((res) => setStations(res.data));
    };

    const getCurrentCity = async () => {
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_GEOAPI_URL}?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=id-ID`
            )
            .then(({ data: { address } }) => setCurrentCity(address));
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
        getStations();
    }, []);

    useEffect(() => {
        if (stations.length > 0) {
            const currLat = coords?.latitude;
            const currLon = coords?.longitude;

            if (coords) {
                const closeStation = findClosestPoint(
                    currLat,
                    currLon,
                    stations
                );
                getCurrentCity();
                setClosestStation(closeStation);
            }
        }
    }, [stations, coords]);

    return (
        <div className="flex flex-col px-6 py-2 h-[calc(100vh-48px)]">
            <div className="grid grid-cols-5 w-1/2">
                <span className="text-white font-bold font-wayfinding tracking-wide">
                    Lokasimu
                </span>
                <div className="flex col-span-4 text-white font-bold font-wayfinding tracking-wide">
                    :{" "}
                    {Object.keys(currentCity).length ? (
                        `${currentCity.neighbourhood}, ${currentCity.city_district}, ${currentCity.city}`
                    ) : (
                        <Skeleton className="ml-1 h-[90%] w-full bg-slate-500/50" />
                    )}
                </div>
                <span className="text-white font-bold font-wayfinding tracking-wide">
                    Stasiun terdekat
                </span>
                <div className="flex col-span-4 text-white font-bold font-wayfinding tracking-wide">
                    :{" "}
                    {Object.keys(closestStation).length ? (
                        `${closestStation.code} - ${closestStation.name}`
                    ) : (
                        <Skeleton className="ml-1 h-[90%] w-full bg-slate-500/50" />
                    )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className="text-white font-bold font-wayfinding">
                    Kereta terdekat:
                    <Datatable data={[]} columns={columns} />
                </div>
                <div className="text-white font-bold font-wayfinding">
                    Bus terdekat:
                    <div className="w-full m-auto">Dalam konstruksi</div>
                </div>
            </div>
        </div>
    );
}
