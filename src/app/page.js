"use client";

import { Inter } from "next/font/google";
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import dynamic from "next/dynamic";
import { FormInputField } from "@/components/FormInputField";
import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

const inter = Inter({ subsets: ["latin"] });
const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
	const [operator, setOperator] = useState("SWAKELOLA");
	const [data, setData] = useState();
	const [autoChecked, setAutoChecked] = useState(false);
	const [btnClicked, setBtnClicked] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedBus, setSearchedBus] = useState({});

	const getData = async () => {
		setBtnClicked(true);

		const prepareData = {
			kode: operator,
			order: "bus.bus_code",
			order2: "ASC",
			order3: "60",
			submit: "CARI",
		};

		await axios.post("http://localhost:3001/", prepareData).then((res) => {
			const dom = new DOMParser().parseFromString(res.data, "text/html");
			const table = dom.getElementsByTagName("table");

			const noHeader = table[0].innerText
				.toString()
				.substring(table[0].innerText.toString().indexOf("DELAY") + 5)
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
									.substring(val.indexOf(".") - 2, val.length)
									.substring(0, 19)
									.split("106")
									.map((cVal, i) =>
										i > 0 ? 106 + cVal : cVal
									)
							: val
									.substring(val.indexOf(".") - 2, val.length)
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
		});
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
		if (btnClicked && autoChecked) {
			const interval = setInterval(() => {
				getData();
			}, 3000);

			return () => clearInterval(interval);
		}
	}, [autoChecked]);

	return (
		<Box display="flex" flexDirection="column" height="100vh" width="100vw">
			<Grid
				container
				columnSpacing={4}
				rowSpacing={2}
				sx={{
					p: "12px 12px 0px 12px",
					mt: "0px",
					mx: "0px",
					alignItems: "flex-end",
				}}
			>
				<Grid item xs={3}>
					<InputLabel shrink htmlFor="op">
						<Typography fontWeight="bold">
							Pilih Operator:
						</Typography>
					</InputLabel>
					<Select
						value={operator}
						onChange={(e) => setOperator(e.target.value)}
						input={<FormInputField fullWidth size="small" />}
					>
						<MenuItem value="SWAKELOLA">PT Transjakarta</MenuItem>
						<MenuItem value="PPD-A">Perum PPD</MenuItem>
						<MenuItem value="BMP">
							PT Bianglala Metropolitan
						</MenuItem>
						<MenuItem value="BAYU HOLONG PERSADA">
							PT Bayu Holong Persada
						</MenuItem>
						<MenuItem value="MAYASARI">PT Mayasari Bhakti</MenuItem>
						<MenuItem value="STEADYSAFE">PT Steady Safe</MenuItem>
					</Select>
				</Grid>
				<Grid xs={3}>
					<Button
						variant="contained"
						sx={{ mr: "16px" }}
						onClick={() => getData()}
					>
						Tampilkan
					</Button>
					<FormControlLabel
						control={
							<Checkbox
								onChange={(e) =>
									setAutoChecked(e.target.checked)
								}
							/>
						}
						label="Update Otomatis"
					/>
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
						disabled={!btnClicked}
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
							zIndex: 9999999,
							backgroundColor: "#fff",
							boxShadow: 1,
						}}
					/>
				</Tooltip>
				<Map data={data} position={searchedBus?.coor} />
			</Box>
		</Box>
	);
}
