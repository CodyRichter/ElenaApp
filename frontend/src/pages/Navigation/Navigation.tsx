import { useState } from "react";
import { Network } from "util/network";
import { Box } from "@mui/material";
import Map from "./Map/Map";
import Sidebar from "./Layout/Sidebar";

type PositionProps = [number, number];

export default function Navigation({ token }: { token: string }) {
    // Sidebar state
    const [startLocation, setStartLocation] = useState<string>("");
    const [endLocation, setEndLocation] = useState<string>("");
    const [navigationType, setNavigationType] = useState<string>("direct");
    const [navigationErrorHidden, setNavigationErrorHidden] =
        useState<boolean>(true);
    const [sliderValue, setSliderValue] = useState<
        number | string | Array<number | string>
    >(9);
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue);
    };

    //map data for the path
    const [origin, setOrigin] = useState<PositionProps | null>(null);
    const [destination, setDestination] = useState<PositionProps | null>(null);
    const [wayPoints, setWayPoints] = useState<PositionProps[] | null>(null);

    //isLoaded to wait for user input
    const [isLoaded, setisLoaded] = useState<boolean>(false);

    // calculating route
    async function calculateRoute() {
        if (startLocation === "" || endLocation === "") {
            return;
        }

        await Network.navigate(
            startLocation,
            endLocation,
            navigationType,
            sliderValue as number,
            token
        )
            .then((result) => {
                console.log(result);
                //set origin
                setOrigin([result.origin[0], result.origin[1]]);
                //set destination
                setDestination([result.destination[0], result.destination[1]]);
                //set waypoints
                setWayPoints(result.waypoints);
                setisLoaded(true);
            })
            .catch((err) => console.log(err));
    }

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                overflow: "hidden",
                maxHeight: "100vh",
            }}
        >
            <Sidebar
                startLocation={startLocation}
                setStartLocation={setStartLocation}
                endLocation={endLocation}
                setEndLocation={setEndLocation}
                navigationType={navigationType}
                setNavigationType={setNavigationType}
                navigationErrorHidden={navigationErrorHidden}
                setNavigationErrorHidden={setNavigationErrorHidden}
                sliderValue={sliderValue}
                handleSliderChange={handleSliderChange}
                calculateRoute={calculateRoute}
            />
            <Map
                origin={origin}
                destination={destination}
                waypoints={wayPoints}
                isLoaded={isLoaded}
            />
        </Box>
    );
}
    