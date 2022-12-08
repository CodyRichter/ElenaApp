import { useState } from "react";
import { Network } from "util/network";
import { Box } from "@mui/material";
import Map from "./Map/Map";
import Sidebar from "./Layout/Sidebar";

interface PositionProps {
    from_lat: number;
    from_long: number;
    to_lat: number;
    to_long: number;
}

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
    const [mapData, setmapData] = useState<PositionProps | null>(null);

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
            token,
        )
            .then((result) => {
                console.log(result);
                setmapData({
                    from_lat: result.origin[0],
                    from_long: result.origin[1],
                    to_lat: result.destination[0],
                    to_long: result.destination[1],
                });
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
            <Map data={mapData} isLoaded={isLoaded} />
        </Box>
    );
}
