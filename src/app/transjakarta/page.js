"use client";

import { Inter } from "next/font/google";
import {
    Backdrop,
    Box,
    CircularProgress,
    FormControlLabel,
    InputLabel,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Grid from "@mui/material/Unstable_Grid2";
import dynamic from "next/dynamic";
import { FormInputField } from "@/components/FormInputField";
import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

const inter = Inter({ subsets: ["latin"] });
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const busOperators = [
    {
        id: "SWAKELOLA",
        code: "TJ",
        name: "PT TRANSJAKARTA",
    },
    {
        id: "MAYASARI",
        code: "MYS/MB",
        name: "PT MAYASARI BHAKTI",
    },
    {
        id: "STEADYSAFE",
        code: "SAF",
        name: "PT STEADY SAFE",
    },
    {
        id: "PPD-A",
        code: "PPD",
        name: "PERUM PPD",
    },
    {
        id: "BMP",
        code: "BMP",
        name: "PT BIANGLALA METROPOLITAN",
    },
    {
        id: "BAYU HOLONG PERSADA",
        code: "BHL",
        name: "PT BAYU HOLONG PERSADA",
    },
];

const Transjakarta = () => {
    const [operator, setOperator] = useState("SWAKELOLA");
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingTooLong, setLoadingTooLong] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    // const [currentDate, setCurrentDate] = useState(new Date());
    const [autoChecked, setAutoChecked] = useState(false);
    const [btnClicked, setBtnClicked] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchedBus, setSearchedBus] = useState({});

    const getData = async () => {
        setBtnClicked(true);
        setLoading(true);

        const prepareData = {
            kode: operator,
            order: "bus.bus_code",
            order2: "ASC",
            order3: "60",
            submit: "CARI",
        };

        const cancelToken = axios.CancelToken.source();

        const timeout = setTimeout(() => {
            cancelToken.cancel("Request timeout");
        }, 30000);

        // dev: localhost:3001
        // prod: tj-bus-tracker.cyclic.app
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/transjakarta/operators`,
                prepareData,
                {
                    cancelToken: cancelToken.token,
                }
            )
            .then((res) => {
                const dom = new DOMParser().parseFromString(
                    res.data,
                    "text/html"
                );
                const table = dom.getElementsByTagName("table");

                const noHeader = table[0].innerText
                    .toString()
                    .substring(
                        table[0].innerText.toString().indexOf("DELAY") + 5
                    )
                    .split(" detik");

                const removeNo = [];
                console.log(noHeader);

                for (let i = 0; i < noHeader.length; i++) {
                    removeNo.push(
                        noHeader[i].replace(
                            noHeader[i]
                                .substring(0, noHeader[i].indexOf(" "))
                                .replace(/[A-Z]/g, ""),
                            ""
                        )
                    );
                    // console.log(
                    // 	noHeader[i].replace(
                    // 		noHeader[i]
                    // 			.substring(0, noHeader[i].indexOf(' '))
                    // 			.replace(/[A-Z]/g, ''),
                    // 		''
                    // 	)
                    // );
                }

                const mappedData = removeNo.map((val) => {
                    return {
                        orig: val,
                        name:
                            val.match(/[0-9]+/) !== null
                                ? val.substring(
                                      0,
                                      val.indexOf(val.match(/[0-9]+/)) +
                                          val.match(/[0-9]+/)[0].length
                                  )
                                : null,
                        coor:
                            val
                                .substring(val.indexOf(".") - 2, val.length)
                                .substring(0, 19)
                                .match("107.") === null
                                ? val
                                      .substring(
                                          val.indexOf(".") - 2,
                                          val.length
                                      )
                                      .substring(0, 19)
                                      .split("106")
                                      .map((cVal, i) =>
                                          i > 0 ? 106 + cVal : cVal
                                      )
                                : val
                                      .substring(
                                          val.indexOf(".") - 2,
                                          val.length
                                      )
                                      .substring(0, 19)
                                      .split("107")
                                      .map((cVal, i) =>
                                          i > 0 ? 107 + cVal : cVal
                                      ),
                        date: val.indexOf("2023"),
                    };
                });

                const fixedData = _.remove(
                    mappedData,
                    (empty) => empty.orig !== ""
                );
                console.log("fixedData: ", fixedData);

                setData(fixedData);
                setLoading(false);
            })
            .catch((err) => {
                if (err) {
                    setErrMsg(
                        "Terdapat kesalahan dalam mengambil posisi bus, silahkan coba kembali."
                    );
                    setLoading(false);
                    setLoadingTooLong(false);
                    setBtnClicked(false);
                }
                if (axios.isCancel(err)) {
                    console.log("cancelled");
                    setLoading(false);
                    setLoadingTooLong(false);
                    setBtnClicked(false);
                }
            })
            .finally(() => clearTimeout(timeout));
    };

    const searchBus = (name) => {
        let fixedName = name
            .toUpperCase()
            .replace("-", "")
            .replace(" ", "")
            .replace(/[^0-9](?=[0-9])/g, "$& ");

        setSearchedBus(_.find(data, ["name", fixedName]));
    };

    useEffect(() => {
        const cancelTokenSource = axios.CancelToken.source();

        return () => {
            cancelTokenSource.cancel("Component unmounted");
        };
    }, []);

    useEffect(() => {
        if (btnClicked && autoChecked) {
            const interval = setInterval(() => {
                getData();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [autoChecked]);

    useEffect(() => {
        if (loading) {
            const timeoutId = setTimeout(() => {
                setLoadingTooLong(true);
            }, 10000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [loading]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentDate(new Date());
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            width="100vw"
            className="h-[calc(100vh-84px)]"
        >
            <Grid
                container
                columnSpacing={3}
                className="px-[12px] pt-2"
                sx={{
                    mt: "0px",
                    mx: "0px",
                    alignItems: "flex-end",
                    zIndex: 1002,
                }}
            >
                <Grid item xs={12} sm={6} lg={4}>
                    <div className="flex flex-col space-y-1">
                        <span className="text-white tracking-wide font-wayfinding font-bold text-xs">
                            Pilih Operator:
                        </span>
                        <Select
                            defaultValue={operator}
                            onValueChange={(e) => setOperator(e)}
                        >
                            <SelectTrigger className="z-[10] tracking-wider font-wayfinding font-semibold border-white text-white">
                                <SelectValue placeholder="Pilih operator bus..." />
                            </SelectTrigger>
                            <SelectContent className="z-[1001] tracking-wide bg-neutral-200 border-[1px] border-black drop-shadow-lg font-wayfinding font-semibold">
                                {busOperators.map((operator) => (
                                    <SelectItem
                                        key={operator.id}
                                        value={operator.id}
                                    >
                                        {operator.code} - {operator.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </Grid>
                <Grid xs={12} sm={6} lg={4}>
                    <div className="flex items-center space-x-4">
                        <Button
                            className="uppercase tracking-wide bg-wayout hover:bg-wayout font-wayfinding text-black font-bold border-white border-[1px]"
                            onClick={() => getData()}
                        >
                            Tampilkan
                        </Button>
                        <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                                id="autoUpdate"
                                className="border-white"
                                checked={autoChecked}
                                onCheckedChange={() =>
                                    setAutoChecked(!autoChecked)
                                }
                            />
                            <label
                                htmlFor="autoUpdate"
                                className="text-sm text-white tracking-wide font-wayfinding font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Auto update
                            </label>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Box
                display="flex"
                position="relative"
                flex={1}
                sx={{
                    "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        height: "36px",
                        width: "200px",
                        borderRadius: 0,
                    },
                }}
            >
                <Backdrop
                    open={loading}
                    sx={{
                        zIndex: 1001,
                        position: "absolute",
                        top: 20,
                    }}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <CircularProgress sx={{ color: "#ffffff" }} />
                        {loadingTooLong && (
                            <Typography
                                sx={{
                                    color: "white",
                                    mt: "16px",
                                    fontWeight: "bold",
                                }}
                            >
                                Mohon tunggu sesaat lagi...
                            </Typography>
                        )}
                    </Box>
                </Backdrop>
                <Tooltip
                    placement="bottom"
                    title={
                        btnClicked
                            ? "Cari bus dengan memasukkan kode bus (cth: SAF 001)"
                            : "Harap lakukan update lokasi terlebih dahulu"
                    }
                    arrow
                >
                    <TextField
                        placeholder="Cari bus"
                        // variant="outlined"
                        size="small"
                        InputLabelProps={{ shrink: false }}
                        disabled={!btnClicked || loading}
                        onBlur={(e) => setSearchText(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <button
                                    onClick={() => searchBus(searchText)}
                                    disabled={!btnClicked}
                                    style={{
                                        padding: "2px 6px 2px 6px",
                                        marginRight: "-4px",
                                    }}
                                >
                                    Cari
                                </button>
                            ),
                        }}
                        sx={{
                            position: "absolute",
                            top: 40, // adjust as needed
                            right: 20, // adjust as needed
                            zIndex: 1000,
                            backgroundColor: "#fff",
                            boxShadow: 1,
                        }}
                    />
                </Tooltip>
                {/* <Typography
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 50,
                        fontSize: "8px",
                        fontWeight: "bold",
                        textAlign: "right",
                    }}
                >
                    {currentDate.toLocaleString("id-ID", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    })}{" "}
                    ※{" "}
                </Typography>
                <Typography
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        fontSize: "8px",
                        fontWeight: "bold",
                    }}
                >
                    9
                </Typography> */}
                <Typography
                    sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        fontSize: "8px",
                        fontWeight: "bold",
                    }}
                    className="text-white font-wayfinding tracking-wide"
                >
                    v1.2.6
                </Typography>
                <Typography
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 10,
                        fontSize: "12px",
                        color: "red",
                        fontWeight: "bold",
                    }}
                >
                    {errMsg}
                </Typography>
                <Map data={data} position={searchedBus?.coor} />
            </Box>
        </Box>
    );
};

export default Transjakarta;
