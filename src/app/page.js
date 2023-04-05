'use client';

import { Inter } from 'next/font/google';
import { Box, Button, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dynamic from 'next/dynamic';
import { FormInputField } from '@/components/FormInputField';
import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';

const inter = Inter({ subsets: ['latin'] });
const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
	const [operator, setOperator] = useState('SEMUA');
	const [data, setData] = useState();

	const getData = async () => {
		const prepareData = {
			kode: operator,
			order: 'bus.bus_code',
			order2: 'ASC',
			order3: '60',
			submit: 'CARI',
		};

		await axios.post('http://localhost:3001/', prepareData).then((res) => {
			const dom = new DOMParser().parseFromString(res.data, 'text/html');
			const table = dom.getElementsByTagName('table');

			const noHeader = table[0].innerText
				.toString()
				.substring(table[0].innerText.toString().indexOf('DELAY') + 5)
				.split(' detik');

			const removeNo = [];
			console.log(noHeader);

			for (let i = 0; i < noHeader.length; i++) {
				removeNo.push(
					noHeader[i].replace(
						noHeader[i]
							.substring(0, noHeader[i].indexOf(' '))
							.replace(/[A-Z]/g, ''),
						''
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
					merk: val.indexOf(
						val.match(
							/(HINO|TOYOTA|ISUZU|MERCEDES|DAIHATSU|SUZUKI|SB0|ZHONGTONG|VOLVO)/
						)
					),
					name: val.substring(
						0,
						val.indexOf(
							val.match(
								/(HINO|TOYOTA|ISUZU|MERCEDES|DAIHATSU|SUZUKI|SB0|ZHONGTONG|VOLVO)/
							)
						)
					),
					coor: val
						.substring(val.indexOf('.') - 2, val.length)
						.substring(0, 19)
						.split('106')
						.map((cVal, i) => (i > 0 ? 106 + cVal : cVal)),
					date: val.indexOf('2023'),
				};
			});

			const fixedData = _.remove(mappedData, (empty) => empty.orig !== '');
			console.log('fixedData: ', fixedData);

			setData(fixedData);
		});
	};

	return (
		<Box display='flex' flexDirection='column' height='100vh' width='100vw'>
			<Grid
				container
				columnSpacing={4}
				rowSpacing={2}
				sx={{ p: '12px', mt: '12px', mx: '0px', alignItems: 'end' }}
			>
				<Grid item xs={3}>
					<InputLabel shrink htmlFor='op'>
						<Typography fontWeight='bold'>Pilih Operator:</Typography>
					</InputLabel>
					<Select
						value={operator}
						onChange={(e) => setOperator(e.target.value)}
						input={<FormInputField fullWidth />}
					>
						<MenuItem value='SEMUA'>Semua Operator</MenuItem>
						<MenuItem value='MAYASARI'>PT Mayasari Bhakti</MenuItem>
						<MenuItem value='STEADYSAFE'>PT Steady Safe</MenuItem>
					</Select>
				</Grid>
				<Grid xs={3}>
					<Button variant='contained' onClick={() => getData()}>
						Tampilkan
					</Button>
				</Grid>
			</Grid>
			<Box display='flex' flex={1}>
				<Map data={data} />
			</Box>
		</Box>
	);
}
