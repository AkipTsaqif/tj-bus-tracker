"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { getStations, selectLandmarks } from "@/store/slices/landmarksSlice";
import useDidMountEffect from "@/hooks/useDidMountEffect";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { TramFront } from "lucide-react";

const newIcon = new L.Icon({
    iconUrl: "/marker-100.png",
    iconRetinaUrl: "/marker-100.png",
    iconSize: [48, 48],
    iconAnchor: [24, 45],
    popupAnchor: [0, -36],
});

const stationIcon = new L.divIcon({
    className: "station-icon",
    html: ReactDOMServer.renderToString(
        <TramFront
            color="#0C1B2A"
            fill="#F9D437"
            strokeWidth={3}
            className="w-3.5 h-3.5"
        />
    ),
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
                L.latLng([-6.0, 104.0]),
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
    const [stationLocations, setStationLocations] = useState([]);

    const dispatch = useDispatch();
    const { stations } = useSelector(selectLandmarks);

    useEffect(() => {
        if (position) setPos(position);
    }, [position]);

    useEffect(() => {
        if (stations.length === 0) {
            dispatch(getStations());
        }
    }, [dispatch]);

    useEffect(() => {
        if (stations.length > 0) {
            const flattenedStation = _.flatMap(stations, (categoryObj) => {
                const category = categoryObj.category;
                const stations = categoryObj.stations;

                return _.map(stations, (station) => {
                    return { ...station, category };
                });
            });

            setStationLocations(flattenedStation);
        }
        console.log(
            _.flatMap(stations, (categoryObj) => {
                const category = categoryObj.category;
                const stations = categoryObj.stations;

                return _.map(stations, (station) => {
                    return { ...station, category };
                });
            })
        );
    }, [stations]);

    return (
        // <Box display='flex' flexDirection='column' justifyContent='center'>
        <Box
            sx={{
                height: "100%",
                width: "100%",
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
                {stationLocations?.map((val, i) => (
                    <Marker
                        key={i}
                        position={[parseFloat(val.lat), parseFloat(val.lon)]}
                        icon={stationIcon}
                    >
                        <Popup>
                            {val.code} - {val.name}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Box>
        // </Box>
    );
};

export default Map;
