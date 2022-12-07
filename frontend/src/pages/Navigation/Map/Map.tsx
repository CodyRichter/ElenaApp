import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import RoutingMachine from "./RoutingMachine";
import UserSVG from "assets/images/user.svg";
import { Popup, Marker } from "react-leaflet";
import useGeoLocation from "hooks/useGeolocation";

interface PositionProps {
    from_lat: number;
    from_long: number;
    to_lat: number;
    to_long: number;
}

interface MapProps {
    data: PositionProps | null;
    isLoaded: boolean;
}

const userIcon = new L.Icon({
    iconUrl: UserSVG,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    className: "user-pointer",
});

const markerHtmlStyles = `
  background-color: #222222;
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

const Map = ({ data, isLoaded }: MapProps) => {
    const { speed, lat, lng } = useGeoLocation();

    return (
        <MapContainer
            style={{
                width: "100%",
                flexShrink: 0,
                height: "100vh",
            }}
            center={[42.387245185056, -72.52620858219004]}
            zoom={13}
            scrollWheelZoom={false}
            alt="map"
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/*======= THE PATH/PATHS ======= */}
            {/* {data.map((position: PositionProps, index: number) => ( */}
            {isLoaded && data !== null && (
                <RoutingMachine
                    from_lat={data.from_lat}
                    from_long={data.from_long}
                    to_lat={data.to_lat}
                    to_long={data.to_long}
                />
            )}
            {/*))}*/}

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
