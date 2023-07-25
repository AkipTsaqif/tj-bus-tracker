"use client";

import { useState } from "react";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import Clock from "react-live-clock";
import Datatable from "@/components/Datatable";
import { Button } from "@/components/ui/button";

const Daop = ({ params }) => {
    const [trainData, setTrainData] = useState([]);

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
        {
            accessorKey: "station",
            header: "Stasiun Berikut",
        },
        {
            accessorKey: "jadwal",
            header: "Jadwal Berangkat",
        },
    ];

    const fetchData = async () => {
        await axios
            .get(`https://tj-bus-tracker.cyclic.app/kci/krl-d${params.daop}`)
            .then((res) => {
                const modifiedData = res.data.map((train) => {
                    return {
                        ...train,
                        station: `${train.station_code} - ${train.station_name}`,
                    };
                });

                setTrainData(modifiedData);
            });
    };

    return (
        <div>
            <div className="flex justify-between items-center mx-8 my-4">
                <h1 className="text-white text-[20px] font-wayfinding font-bold">
                    KCI Daop I
                </h1>
                <Clock
                    className="text-white font-wayfinding font-bold text-center text-[28px]"
                    format={"HH:mm:ss"}
                    ticking={true}
                    timezone={"Asia/Jakarta"}
                />
                <Button
                    className="uppercase tracking-wide bg-wayout hover:bg-wayout font-wayfinding text-black font-bold border-white border-[1px]"
                    onClick={() => fetchData()}
                >
                    Refresh Data
                </Button>
            </div>
            <div className="container m-auto">
                <Datatable columns={columns} data={trainData} />
            </div>
        </div>
    );
};

export default Daop;
