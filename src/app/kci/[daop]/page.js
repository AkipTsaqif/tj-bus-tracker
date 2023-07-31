"use client";

import { useState } from "react";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import Clock from "react-live-clock";
import Datatable from "@/components/Datatable";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import Fuse from "fuse.js";

const Daop = ({ params }) => {
    const [trainData, setTrainData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    const stationList = {
        redLine: [
            "JAKK - Jakarta Kota",
            "JAY - Jayakarta",
            "MGB - Mangga Besar",
            "SW - Sawah Besar",
            "JUA - Juanda",
            "GDD - Gondangdia",
            "CKI - Cikini",
            "MRI - Manggarai",
            "TEB - Tebet",
            "CW - Cawang",
            "DRN - Duren Kalibata",
            "PSMB - Pasar Minggu Baru",
            "PSM - Pasar Minggu",
            "TNT - Tanjung Barat",
            "LNA - Lenteng Agung",
            "UP - Universitas Pancasila",
            "UI - Universitas Indonesia",
            "POC - Pondok Cina",
            "DPB - Depok Baru",
            "DP - Depok",
            "CTA - Citayam",
            "BJD - Bojonggede",
            "CLT - Cilebut",
            "BOO - Bogor",
        ],
        namboLine: [
            "JAKK - Jakarta Kota",
            "JAY - Jayakarta",
            "MGB - Mangga Besar",
            "SW - Sawah Besar",
            "JUA - Juanda",
            "GDD - Gondangdia",
            "CKI - Cikini",
            "MRI - Manggarai",
            "TEB - Tebet",
            "CW - Cawang",
            "DRN - Duren Kalibata",
            "PSMB - Pasar Minggu Baru",
            "PSM - Pasar Minggu",
            "TNT - Tanjung Barat",
            "LNA - Lenteng Agung",
            "UP - Universitas Pancasila",
            "UI - Universitas Indonesia",
            "POC - Pondok Cina",
            "DPB - Depok Baru",
            "DP - Depok",
            "CTA - Citayam",
            "CBN - Cibinong",
            "NMO - Nambo",
        ],
        blueLine: [
            "POK - Pondok Jati",
            "KMT - Kramat",
            "GST - Gang Sentiong",
            "PSE - Pasar Senen",
            "KMO - Kemayoran",
            "RJW - Rajawali",
            "KPB - Kampung Bandan",
            "AK - Angke",
            "DU - Duri",
            "THB - Tanahabang",
            "KAT - Karet",
            "SUDB - Sudirman Baru",
            "SUD - Sudirman",
            "MRI - Manggarai",
            "MTR - Matraman",
            "JNG - Jatinegara",
            "KLD - Klender",
            "BUA - Buaran",
            "KLDB - Klender Baru",
            "CUK - Cakung",
            "KRI - Kranji",
            "BKS - Bekasi",
            "BKST - Bekasi Timur",
            "TB - Tambun",
            "CIT - Cibitung",
            "TLM - Telagamurni",
            "CKR - Cikarang",
        ],
        brownLine: [
            "DU - Duri",
            "GRG - Grogol",
            "PSG - Pesing",
            "TKO - Taman Kota",
            "BOI - Bojong Indah",
            "RW - Rawabuaya",
            "KDS - Kalideres",
            "PI - Poris",
            "BPR - Batuceper",
            "TTI - Tanah Tinggi",
            "TNG - Tangerang",
        ],
        greenLine: [
            "THB - Tanahabang",
            "PLM - Palmerah",
            "KBY - Kebayoran",
            "PDJ - Pondok Ranji",
            "JU - Jurangmangu",
            "SDM - Sudimara",
            "RU - Rawabuntu",
            "SRP - Serpong",
            "CSK - Cisauk",
            "CC - Cicayur",
            "PRP - Parungpanjang",
            "CJT - Cilejit",
            "DAR - Daru",
            "TEJ - Tenjo",
            "TGS - Tigaraksa",
            "CKY - Cikoya",
            "MJ - Maja",
            "CTR - Citeras",
            "RK - Rangkasbitung",
        ],
        pinkLine: [
            "JAKK - Jakarta Kota",
            "KPB - Kampung Bandan",
            "AC - Ancol",
            "TPK - Tanjung Priuk",
        ],
    };

    const trainType = (train) => {
        let matchResult;
        if (train) matchResult = train.match(/[a-zA-Z+]+/);

        const type = matchResult ? matchResult[0] : "";
        let regex;

        if (type === "TM") regex = /^(\d+)TM(\d+)$/;
        if (type === "JR") regex = /^(\d+)JR(\d+)(\+\d+)?$/;
        if (type === "T") regex = /^(\d+)T(\d+)$/;

        let matches;
        if (train) matches = train.match(regex);

        if (!matches) {
            return "Tidak diketahui";
        }

        const [_, xNumber, yNumber, zNumber] = matches;

        if (type === "TM")
            return `Tokyo Metro ${xNumber.substring(0, 1)}1${yNumber}`;
        if (type === "JR")
            return `JR${xNumber}-${yNumber}${
                zNumber !== undefined ? zNumber : ""
            }`;
        if (type === "T") return `Tokyu ${xNumber.substring(0, 1)}1${yNumber}`;
    };

    const currentStation = (prevStation, trainNo) => {
        let strippedTrainNo;

        const stripKlb = trainNo.match(/\/(\d+)/);
        if (stripKlb) {
            strippedTrainNo = stripKlb[1];
        } else {
            strippedTrainNo = trainNo.replace(/\D/g, "");
        }

        const no = strippedTrainNo.substring(0, 2);
        const upTrain = strippedTrainNo % 2 === 1; // up nomor ganjil
        let currStation;
        let prevStationIndex;

        if (no === "11" || no === "12" || no === "13" || no === "14") {
            const trainLine = stationList.redLine;
            prevStationIndex = _.findIndex(trainLine, (e) =>
                _.includes(e, prevStation)
            );

            if (upTrain)
                currStation =
                    trainLine[
                        prevStationIndex > 0
                            ? prevStationIndex - 1
                            : prevStationIndex
                    ];
            else
                currStation =
                    trainLine[
                        prevStationIndex < trainLine.length - 1
                            ? prevStationIndex + 1
                            : prevStationIndex
                    ];
        } else if (no === "15") {
            const trainLine = stationList.namboLine;
            prevStationIndex = _.findIndex(trainLine, (e) =>
                _.includes(e, prevStation)
            );

            if (upTrain)
                currStation =
                    trainLine[
                        prevStationIndex > 0
                            ? prevStationIndex - 1
                            : prevStationIndex
                    ];
            else
                currStation =
                    trainLine[
                        prevStationIndex < trainLine.length - 1
                            ? prevStationIndex + 1
                            : prevStationIndex
                    ];
        } else if (no === "16" || no === "17" || no === "18") {
            const trainLine = stationList.greenLine;
            prevStationIndex = _.findIndex(trainLine, (e) =>
                _.includes(e, prevStation)
            );

            if (upTrain)
                currStation =
                    trainLine[
                        prevStationIndex > 0
                            ? prevStationIndex - 1
                            : prevStationIndex
                    ];
            else
                currStation =
                    trainLine[
                        prevStationIndex < trainLine.length - 1
                            ? prevStationIndex + 1
                            : prevStationIndex
                    ];
        } else if (no === "19" || no === "20") {
            const trainLine = stationList.brownLine;
            prevStationIndex = _.findIndex(trainLine, (e) =>
                _.includes(e, prevStation)
            );

            if (upTrain)
                currStation =
                    trainLine[
                        prevStationIndex > 0
                            ? prevStationIndex - 1
                            : prevStationIndex
                    ];
            else
                currStation =
                    trainLine[
                        prevStationIndex < trainLine.length - 1
                            ? prevStationIndex + 1
                            : prevStationIndex
                    ];
        } else if (no === "24") {
            const trainLine = stationList.pinkLine;
            prevStationIndex = _.findIndex(trainLine, (e) =>
                _.includes(e, prevStation)
            );

            if (upTrain)
                currStation =
                    trainLine[
                        prevStationIndex > 0
                            ? prevStationIndex - 1
                            : prevStationIndex
                    ];
            else
                currStation =
                    trainLine[
                        prevStationIndex < trainLine.length - 1
                            ? prevStationIndex + 1
                            : prevStationIndex
                    ];
        } else if (no === "40" || no === "41") {
            const trainLine = stationList.blueLine;
            prevStationIndex = _.findIndex(trainLine, (e) =>
                _.includes(e, prevStation)
            );

            if (upTrain) {
                if (prevStationIndex > 15)
                    currStation = trainLine[prevStationIndex - 1];
                else if (prevStationIndex === 15) currStation = trainLine[0];
                else currStation = trainLine[prevStationIndex + 1];
            } else
                currStation =
                    trainLine[
                        prevStationIndex < trainLine.length - 1
                            ? prevStationIndex + 1
                            : prevStationIndex
                    ];
        } else if (no === "50" || no === "51" || no === "57") {
            const trainLine = stationList.blueLine;
            prevStationIndex = _.findIndex(trainLine, (e) =>
                _.includes(e, prevStation)
            );

            if (upTrain) {
                currStation =
                    trainLine[
                        prevStationIndex > 0
                            ? prevStationIndex - 1
                            : prevStationIndex
                    ];
            } else
                currStation =
                    trainLine[
                        prevStationIndex < trainLine.length - 1
                            ? prevStationIndex + 1
                            : prevStationIndex
                    ];
        } else if (no === "55") {
            const trainLine = stationList.blueLine;
            prevStationIndex = _.findIndex(trainLine, (e) =>
                _.includes(e, prevStation)
            );

            // ckr-mri-kpb
            if (upTrain) currStation = trainLine[prevStationIndex - 1];
            // kpb-jng-ckr
            else {
                if (prevStationIndex < 7)
                    currStation = trainLine[prevStationIndex - 1];
                else if (prevStationIndex === 0) currStation = trainLine[15];
                else
                    currStation =
                        trainLine[
                            prevStationIndex < trainLine.length
                                ? prevStationIndex + 1
                                : prevStationIndex
                        ];
            }
        }

        return currStation;
    };

    const findCurrDeptTime = (trainDetail, trainNo, currStation) => {
        if (currStation === undefined) {
            return "11:11:00";
        }

        let stationSubstring = currStation.slice(currStation.indexOf("-") + 2);

        const dottedStationNames = [
            "UP - Universitas Pancasila",
            "UI - Universitas Indonesia",
            "PSMB - Pasar Minggu Baru",
            "TLM - Telagamurni",
        ];

        const fixDottedNames = [
            "Univ.Pancasila",
            "Univ.Indonesia",
            "Pas.Minggubaru",
            "M.Telagamurni",
        ];

        const isDotted = _.includes(dottedStationNames, currStation);

        if (isDotted) {
            const dottedStationIndex = dottedStationNames.indexOf(currStation);
            stationSubstring = fixDottedNames[dottedStationIndex];
        }

        const stations = trainDetail.flatMap((entry) => {
            if (Array.isArray(entry.data))
                return entry.data.map((stationData) => ({
                    train_no: stationData.train_no,
                    station: stationData.station,
                }));
            else return [];
        });

        const fuseOptions = {
            includeScore: true,
            threshold: 0.3,
            keys: ["station"],
        };

        const fuse = new Fuse(stations, fuseOptions);
        const searchResult = fuse.search(stationSubstring);
        if (trainNo === 1251) console.log(searchResult);
        if (trainNo === "1255") console.log(searchResult);

        let time = "11:11:11";
        searchResult.forEach((searchResult) => {
            const matchingStation = searchResult.item;
            const { train_no: foundTrainNo } = matchingStation;

            if (foundTrainNo === trainNo) {
                const foundTimeEntry = trainDetail.find(
                    (entry) => entry.data[0].train_no === foundTrainNo
                );

                if (trainNo === "1251") console.log(foundTimeEntry);

                const foundTime = foundTimeEntry.data.find(
                    (stationData) =>
                        stationData.train_no === trainNo &&
                        stationData.station === matchingStation.station
                );
                if (trainNo === 1251) console.log(foundTime);
                if (trainNo === "1251") console.log(matchingStation);
                if (trainNo === "1251") console.log(stations);
                if (trainNo === "1251") console.log(currStation);

                if (foundTime) {
                    time = foundTime.time;
                }
            }
        });

        return time;
    };

    const fetchData = async () => {
        setIsLoading(true);
        setTrainData([]);
        await axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}kci/krl-d${params.daop}`)
            .then((res) => {
                console.log(res.data);
                const modifiedData = res.data.location.map((train) => {
                    return {
                        ...train,
                        sf: train.sf ? train.sf : "-",
                        trainset: trainType(train.trainset),
                        station: currentStation(train.station_code, train.noka),
                        jadwal: findCurrDeptTime(
                            res.data.detail,
                            train.noka,
                            currentStation(train.station_code, train.noka)
                        ),
                    };
                });

                setTrainData(modifiedData);
            })
            .then(() => setIsLoading(false));
    };

    return (
        <div>
            <div className="absolute left-6 top-12 text-white text-[10px] font-wayfinding">
                v1.2.6
            </div>
            <div className="flex justify-between items-center mx-6 my-4">
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
                    disabled={isLoading}
                >
                    Refresh Data
                </Button>
            </div>
            <div className="mx-6">
                <Datatable
                    columns={columns}
                    data={trainData}
                    loading={isLoading}
                />
            </div>
        </div>
    );
};

export default Daop;
