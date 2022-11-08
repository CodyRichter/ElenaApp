import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

interface RoutingProps {
    from_lat: number;
    from_long: number;
    to_lat: number;
    to_long: number;
}

const createRoutineMachineLayer = ({
    from_lat,
    from_long,
    to_lat,
    to_long,
}: RoutingProps) => {
    const instance = L.Routing.control({
        waypoints: [L.latLng(from_lat, from_long), L.latLng(to_lat, to_long)],
        lineOptions: {
            styles: [
                {
                    color: "blue",
                    opacity: "0.7",
                    weight: 6,
                },
            ],
        },
        show: true,
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;