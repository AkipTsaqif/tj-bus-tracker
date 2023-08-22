"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, Check, ChevronsUpDown } from "lucide-react";
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

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
];

const DaopTimetable = ({ params }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const dispatch = useDispatch();
    const krlList = useSelector(selectKRLData);

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
            cell: (props) => (
                <span className="font-bold">{props.getValue()}</span>
            ),
        },
        {
            accessorKey: "jadwal",
            header: "Jadwal Berangkat",
            cell: (props) => (
                <div className="font-bold">
                    <span className="mr-2">{props.getValue()}</span>
                    <span
                        className={`${
                            timeDifference(props.getValue()).substring(0, 1) ===
                            "+"
                                ? "text-red-500"
                                : "text-green-500"
                        }`}
                    >{`(${timeDifference(props.getValue())})`}</span>
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

    const fetchData = () => {
        setIsLoading(true);
        dispatch(getKRLData(params.type)).then(() => setIsLoading(false));
    };

    return (
        <div>
            {/* <div className="absolute left-6 top-12 text-white text-[10px] font-wayfinding">
                v1.2.6
            </div> */}
            <div className="flex justify-between items-center mx-6 my-4">
                {params.type === "all" ? (
                    <h1 className="text-white text-[20px] font-wayfinding font-bold">
                        KCI Daop I
                    </h1>
                ) : (
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
                                className="w-[200px] justify-between bg-waybase text-white font-wayfinding font-bold hover:bg-wayout hover:text-black"
                            >
                                {value
                                    ? frameworks.find(
                                          (framework) =>
                                              framework.value === value
                                      )?.label
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
                                <CommandGroup>
                                    {frameworks.map((framework) => (
                                        <CommandItem
                                            key={framework.value}
                                            onSelect={(currentValue) => {
                                                setValue(
                                                    currentValue === value
                                                        ? ""
                                                        : currentValue
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === framework.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {framework.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}
                <Clock
                    className="text-white font-wayfinding font-bold text-center text-[28px]"
                    format={"HH:mm:ss"}
                    ticking={true}
                    timezone={"Asia/Jakarta"}
                />
                <Button
                    className="uppercase tracking-wide bg-wayout hover:bg-wayout font-wayfinding text-black font-bold border-white border-[1px]"
                    onClick={() => fetchData()}
                    disabled={isLoading}
                >
                    Refresh Data
                </Button>
            </div>
            <div className="mx-6">
                <Datatable
                    columns={columns}
                    data={krlList}
                    loading={isLoading}
                />
            </div>
        </div>
    );
};

export default DaopTimetable;
