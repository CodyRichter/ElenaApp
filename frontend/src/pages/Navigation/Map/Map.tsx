import L from "leaflet";
import {
    MapContainer,
    TileLayer,
    FeatureGroup,
    Marker,
    Polyline,
    Popup,
} from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import useGeoLocation from "hooks/useGeolocation";
import { isEmpty } from "lodash";
import { Fab } from "@mui/material";
import { divIcon } from "leaflet";
import { PinDrop, TripOrigin } from "@mui/icons-material";

type PositionProps = [number, number];

interface MapProps {
    origin: PositionProps | null;
    destination: PositionProps | null;
    waypoints: PositionProps[] | null;
    isLoaded: boolean;
}

const startRender = renderToStaticMarkup(
    <Fab size="small" color="primary">
        <TripOrigin />
    </Fab>
);

const endRender = renderToStaticMarkup(
    <Fab size="small" color="secondary">
        <PinDrop />
    </Fab>
);

const startLocationIcon = divIcon({
    html: startRender
});

const endLocationIcon = divIcon({
    html: endRender
});

const markerHtmlStyles = `
  background-color: #0978f6;
  width: 2rem;
  height: 2rem;
  display: block;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

const icon = L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`,
});

const Map = ({ origin, destination, waypoints, isLoaded }: MapProps) => {
    const { lat, lng } = useGeoLocation();

    return (
        <MapContainer
            style={{
                width: "100%",
                flexShrink: 0,
                height: "100vh",
            }}
            center={[42.387245185056, -72.52620858219004]}
            zoom={13}
            scrollWheelZoom={true}
            alt="map"
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/*======= MARKER FOR ORIGIN ======= */}
            {isLoaded && origin !== null && (
                <Marker position={[origin[0], origin[1]]} icon={startLocationIcon}>
                    <Popup>
                        <p>Origin</p>
                    </Popup>
                </Marker>
            )}

            {/*======= THE PATH/PATHS ======= */}
            {isLoaded && !isEmpty(waypoints) && (
                <FeatureGroup>
                    <Polyline positions={waypoints} color="red" />
                </FeatureGroup>
            )}

            {/*======= MARKER FOR DESTINATION ======= */}
            {isLoaded && destination !== null && (
                <Marker position={[destination[0], destination[1]]} icon={endLocationIcon}>
                    <Popup>
                        <p>Destination</p>
                    </Popup>
                </Marker>
            )}

            {/*======= MARKER FOR USER POSITION ======= */}
            <Marker position={[lat, lng]} icon={icon}>
                <Popup>
                    <p>User Location</p>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
