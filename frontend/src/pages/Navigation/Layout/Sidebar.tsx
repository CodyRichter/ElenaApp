import React, { Dispatch, SetStateAction } from "react";
import {
    KeyboardArrowUp,
    KeyboardArrowDown,
    LocationOn,
} from "@mui/icons-material";
import {
    Box,
    Button,
    Drawer,
    ButtonGroup,
    TextField,
    Typography,
} from "@mui/material";
import Slider from "@mui/material/Slider";
import { NavigationTypeButton } from "./SidebarComponents/NavigationTypeButton";
import { NavigationErrorBox } from "./SidebarComponents/NavigationErrorBox";

interface SidebarProps {
    startLocation: string;
    setStartLocation: Dispatch<SetStateAction<string>>;
    endLocation: string;
    setEndLocation: Dispatch<SetStateAction<string>>;
    navigationType: string;
    setNavigationType: Dispatch<SetStateAction<string>>;
    navigationErrorHidden: boolean;
    setNavigationErrorHidden: Dispatch<SetStateAction<boolean>>;
    sliderValue: number | string | Array<number | string>;
    handleSliderChange: (event: Event, newValue: number | number[]) => void;
    calculateRoute: () => Promise<void>;
}

export default function Sidebar({
    startLocation,
    setStartLocation,
    endLocation,
    setEndLocation,
    navigationType,
    setNavigationType,
    navigationErrorHidden,
    setNavigationErrorHidden,
    sliderValue,
    handleSliderChange,
    calculateRoute,
}: SidebarProps) {
    async function startNavigation() {
        setNavigationErrorHidden(false);
    }

    return (
        <Drawer
            sx={{ width: "400px", maxHeight: "100%", flexShrink: 0 }}
            variant="permanent"
            anchor="left"
            open={true}
            data-testid="sidebar"
        >
            <Box sx={{ width: "400px", padding: "2rem" }} role="presentation">
                <Typography variant="h4" align="center">
                    Route Selection
                </Typography>

                <TextField
                    fullWidth
                    inputProps={{ "data-testid": "startLocation" }}
                    className="mt-3 mb-3"
                    label="Origin"
                    variant="outlined"
                    onChange={(event) => setStartLocation(event?.target.value)}
                />

                <TextField
                    fullWidth
                    inputProps={{ "data-testid": "endLocation" }}
                    className="mt-3 mb-3"
                    label="Destination"
                    variant="outlined"
                    onChange={(event) => setEndLocation(event?.target.value)}
                />

                <Typography variant="h6" className="mt-3 mb-1">
                    Navigation Mode
                </Typography>
                <ButtonGroup
                    className="mb-3"
                    variant="contained"
                    aria-label="outlined primary button group"
                >
                    <NavigationTypeButton
                        targetNavigationType="minimize_elevation"
                        navigationDescription="Minimize Elevation"
                        buttonIcon={<KeyboardArrowDown />}
                        navigationType={navigationType}
                        setNavigationType={setNavigationType}
                        data-testid="minimizeElevationButton"
                    />
                    <NavigationTypeButton
                        targetNavigationType="direct"
                        navigationDescription="Most Direct"
                        buttonIcon={<LocationOn />}
                        navigationType={navigationType}
                        setNavigationType={setNavigationType}
                        data-testid="directButton"
                    />
                    <NavigationTypeButton
                        targetNavigationType="maximize_elevation"
                        navigationDescription="Maximize Elevation"
                        buttonIcon={<KeyboardArrowUp />}
                        navigationType={navigationType}
                        setNavigationType={setNavigationType}
                        data-testid="maximizeElevationButton"
                    />
                </ButtonGroup>

                <Typography variant="h6" className="mt-3 mb-1">
                    Maximum Route Distance
                </Typography>

                <Box
                    sx={{
                        width: "80%",
                        marginInline: "auto",
                        marginTop: "1rem",
                        display: "flex",
                        gap: "2rem",
                    }}
                >
                    <Typography variant="h6" data-testid="minDistanceThreshold">
                        {navigationType === "direct" ? "-" : "1x"}
                    </Typography>
                    <Slider
                        sx={{
                            width: "100%",
                            flexShrink: 1,
                        }}
                        valueLabelDisplay="auto"
                        defaultValue={10}
                        onChange={handleSliderChange}
                        step={1}
                        min={1}
                        max={10}
                        marks={[]}
                        disabled={navigationType === "direct"}
                        data-testid="distanceSlider"
                    />

                    <Typography variant="h6" data-testid="maxDistanceThreshold">
                        {navigationType === "direct" ? "-" : "10x"}
                    </Typography>
                </Box>
                <Typography
                    variant="h4"
                    align="center"
                    data-testid="currDistanceThreshold"
                >
                    {navigationType === "direct" ? "-" : sliderValue + "x"}
                </Typography>

                <Typography align="center" variant="body2">
                    How many times longer than the shortest route would you are
                    willing to travel.
                </Typography>

                <Button
                    variant="contained"
                    className="mt-4"
                    onClick={calculateRoute}
                    fullWidth
                    data-testid="startNavigationButton"
                >
                    Navigate
                </Button>

                <NavigationErrorBox
                    hidden={navigationErrorHidden}
                    startLocation={startLocation}
                    endLocation={endLocation}
                    navigationType={navigationType}
                />
            </Box>
        </Drawer>
    );
}
