import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import useDidMountEffect from "@/hooks/useDidMountEffect";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

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

const Routing = () => {
    const [routeStart, setRouteStart] = useState([
        -6.1841068706691, 106.90842634467441,
    ]);
    const [routeEnd, setRouteEnd] = useState([
        -6.204374442486765, 106.82344922340089,
    ]);

    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(routeStart),
                L.latLng([-6.19245976162803, 106.90501986014483]),
                L.latLng(routeEnd),
            ],
            routeWhileDragging: true,
            lineOptions: {
                styles: [
                    { color: "orange", opacity: 0.5, weight: 8 },
                    { color: "#122254", opacity: 0.7, weight: 4 },
                ],
            },
            createMarker: () => null,
        }).addTo(map);

        const routeInstructionsContainer = document.querySelector(
            ".leaflet-routing-container"
        );
        routeInstructionsContainer.style.display = "none";

        return () => map.removeControl(routingControl);
    }, [map]);

    return null;
};

const Map = ({ data, position }) => {
    const [pos, setPos] = useState([-6.225911, 106.832819]);

    useEffect(() => {
        if (position) setPos(position);
    }, [position]);

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
                {/* <Routing /> */}
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
