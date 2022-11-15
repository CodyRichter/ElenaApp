import React from "react";
import { KeyboardArrowUp, KeyboardArrowDown, LocationOn } from "@mui/icons-material";
import { Box, Button, Drawer, ButtonGroup, TextField, Typography } from "@mui/material";
import Slider from "@mui/material/Slider";
import { NavigationTypeButton } from "./SidebarComponents/NavigationTypeButton";
import { NavigationErrorBox } from "./SidebarComponents/NavigationErrorBox";

export default function Sidebar() {

    const [startLocation, setStartLocation] = React.useState<string>('');
    const [endLocation, setEndLocation] = React.useState<string>('');
    const [navigationType, setNavigationType] = React.useState<string>('mostDirect');
    const [navigationErrorHidden, setNavigationErrorHidden] = React.useState<boolean>(true);

    const [sliderValue, setSliderValue] = React.useState<
        number | string | Array<number | string>
    >(9);

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue);
    };

    async function startNavigation() {
        console.log('starting navigation');
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
                <Typography
                    variant="h4"
                    align="center"
                >
                    Route Selection
                </Typography>
                <TextField
                    fullWidth
                    inputProps={{ "data-testid": "startLocation" }}
                    className="mt-3 mb-3"
                    label="Origin"
                    variant="outlined"
                    onChange={(event) => setStartLocation(event.target.value)}
                />

                <TextField
                    fullWidth
                    inputProps={{ "data-testid": "endLocation" }}
                    className="mt-3 mb-3"
                    label="Destination"
                    variant="outlined"
                    onChange={(event) => setEndLocation(event.target.value)}
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
                        targetNavigationType="minimizeElevation"
                        navigationDescription="Minimize Elevation"
                        buttonIcon={<KeyboardArrowDown />}
                        navigationType={navigationType}
                        setNavigationType={setNavigationType}
                        data-testid="minimizeElevationButton"
                    />
                    <NavigationTypeButton
                        targetNavigationType="mostDirect"
                        navigationDescription="Most Direct"
                        buttonIcon={<LocationOn />}
                        navigationType={navigationType}
                        setNavigationType={setNavigationType}
                        data-testid="mostDirectButton"
                    />
                    <NavigationTypeButton
                        targetNavigationType="maximizeElevation"
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
                        {navigationType === "mostDirect" ? "-" : "1x"}
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
                        disabled={navigationType === "mostDirect"}
                        data-testid="distanceSlider"
                    />

                    <Typography variant="h6" data-testid="maxDistanceThreshold">
                        {navigationType === "mostDirect" ? "-" : "10x"}
                    </Typography>
                </Box>
                <Typography variant="h4" align="center" data-testid="currDistanceThreshold">
                    {navigationType === "mostDirect" ? "-" : sliderValue + "x"}
                </Typography>

                <Typography align="center" variant="body2">
                    How many times longer than the shortest route would you are willing to travel.
                </Typography>

                <Button
                    variant="contained"
                    className="mt-4"
                    onClick={startNavigation}
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
