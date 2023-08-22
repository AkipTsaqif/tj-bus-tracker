import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";
import Fuse from "fuse.js";

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
        return `JR${xNumber}-${yNumber}${zNumber !== undefined ? zNumber : ""}`;
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

export const getKRLData = createAsyncThunk("krl", async (daop) => {
    console.log("masuk redux");
    const resp = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kci/krl-${daop}`
    );
    const trainData = resp.data;
    const modifiedTrainData = trainData.location.map((train) => {
        return {
            ...train,
            sf: train.sf ? train.sf : "-",
            trainset: trainType(train.trainset),
            station: currentStation(train.station_code, train.noka),
            jadwal: findCurrDeptTime(
                trainData.detail,
                train.noka,
                currentStation(train.station_code, train.noka)
            ),
        };
    });

    return modifiedTrainData;
});

const krlSlice = createSlice({
    name: "krl",
    initialState: [],
    reducers: {},
    extraReducers: {
        [getKRLData.fulfilled]: (state, action) => action.payload,
    },
});

export const selectKRLData = ({ krlSlice }) => krlSlice;

export default krlSlice.reducer;
