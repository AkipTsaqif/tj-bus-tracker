import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import marker from '../../public/marker-100.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const newIcon = new L.Icon({
	iconUrl: '/marker-100.png',
	iconRetinaUrl: '/marker-100.png',
	iconSize: [64, 64],
	// iconAnchor: [60, 60],
});

const Map = ({ data }) => {
	const pos = [-6.225911, 106.832819];

	if (data) console.log('data di map: ', data);

	return (
		// <Box display='flex' flexDirection='column' justifyContent='center'>
		<Box
			sx={{
				// height: '100%',
				width: '100%',
				margin: '24px',
				border: '1px solid gray',
				// backgroundColor: 'rgb(125, 193, 220)',
				// display: 'flex',
				// flexDirection: 'column',
				// alignItems: 'center',
				// justifyContent: 'center',
				color: 'whitesmoke',
				borderRadius: '4px',
			}}
		>
			<MapContainer center={pos} zoom={12} scrollWheelZoom={true}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				{data?.map((val, i) => (
					<Marker
						key={i}
						position={[parseFloat(val.coor[0]), parseFloat(val.coor[1])]}
						icon={newIcon}
					>
						<Popup>{val.orig}</Popup>
					</Marker>
				))}
			</MapContainer>
		</Box>
		// </Box>
	);
};

export default Map;
