import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useDidMountEffect from "@/hooks/useDidMountEffect";

const newIcon = new L.Icon({
	iconUrl: "/marker-100.png",
	iconRetinaUrl: "/marker-100.png",
	iconSize: [48, 48],
	iconAnchor: [24, 45],
	popupAnchor: [0, -36],
});

const Centering = ({ lat, lng }) => {
	const map = useMap();

	useDidMountEffect(() => {
		map.setView([lat, lng], 16);
	}, [lat, lng]);

	return null;
};

const Map = ({ data, position }) => {
	const [pos, setPos] = useState([-6.225911, 106.832819]);

	useEffect(() => {
		if (position) setPos(position);
	}, [position]);

	if (data) console.log("data di map: ", data);

	return (
		// <Box display='flex' flexDirection='column' justifyContent='center'>
		<Box
			sx={{
				// height: '100%',
				width: "100%",
				mt: "24px",
				border: "1px solid gray",
				// backgroundColor: 'rgb(125, 193, 220)',
				// display: 'flex',
				// flexDirection: 'column',
				// alignItems: 'center',
				// justifyContent: 'center',
				color: "whitesmoke",
			}}
		>
			<MapContainer center={pos} zoom={12} scrollWheelZoom={true}>
				<Centering lat={pos[0]} lng={pos[1]} />
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{data?.map((val, i) => (
					<Marker
						key={i}
						position={[
							parseFloat(val.coor[0]),
							parseFloat(val.coor[1]),
						]}
						icon={newIcon}
					>
						<Popup>{val.name}</Popup>
					</Marker>
				))}
			</MapContainer>
		</Box>
		// </Box>
	);
};

export default Map;
