import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ButtonGroup, TextField, Typography } from "@mui/material";
import Slider from "@mui/material/Slider";

export default function Sidebar() {
    const [sliderValue, setSliderValue] = React.useState<
        number | string | Array<number | string>
    >(9);

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue);
    };

    return (
        <Drawer
            sx={{ width: "400px", maxHeight: "100%", flexShrink: 0 }}
            variant="permanent"
            anchor="left"
            open={true}
        >
            <Box sx={{ width: "400px", padding: "2rem" }} role="presentation">
                <Typography
                    variant="h4"
                    sx={{ textAlign: "center", marginBottom: "2rem" }}
                >
                    Route Selection
                </Typography>
                <TextField
                    sx={{ width: "100%", marginBottom: "2rem" }}
                    id="filled-basic"
                    label="Origin"
                    variant="filled"
                />

                <TextField
                    sx={{ width: "100%", marginBottom: "2rem" }}
                    id="filled-basic"
                    label="Destination"
                    variant="filled"
                />

                <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
                    Navigation Mode
                </Typography>

                <ButtonGroup
                    sx={{ marginBottom: "2rem" }}
                    variant="contained"
                    aria-label="outlined primary button group"
                >
                    <Button
                        sx={{
                            backgroundColor: "#5723E3",
                            display: "flex",
                            flexDirection: "column",
                            paddingBlock: ".75rem",
                        }}
                    >
                        <KeyboardArrowDownIcon />
                        <Typography
                            sx={{ marginTop: ".5rem" }}
                            align="center"
                            variant="body2"
                        >
                            Minimize Elevation
                        </Typography>
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: "#5723E3",
                            display: "flex",
                            flexDirection: "column",
                            paddingBlock: ".75rem",
                        }}
                    >
                        <LocationOnIcon />
                        <Typography
                            sx={{ marginTop: ".5rem" }}
                            align="center"
                            variant="body2"
                        >
                            Most Direct
                        </Typography>
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: "#5723E3",
                            display: "flex",
                            flexDirection: "column",
                            paddingBlock: ".75rem",
                        }}
                    >
                        <KeyboardArrowUpIcon />
                        <Typography
                            sx={{ marginTop: ".5rem" }}
                            align="center"
                            variant="body2"
                        >
                            Maximize Elevation
                        </Typography>
                    </Button>
                </ButtonGroup>

                <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
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
                    <Typography variant="h5">1x</Typography>
                    <Slider
                        sx={{
                            width: "100%",
                            flexShrink: 1,
                        }}
                        aria-label="Always visible"
                        valueLabelDisplay="auto"
                        defaultValue={10}
                        onChange={handleSliderChange}
                        getAriaValueText={valuetext}
                        step={1}
                        min={1}
                        max={10}
                        marks={[]}
                    />
                    <Typography variant="h5">10x</Typography>
                </Box>

                <Typography align="center" variant="h6">
                    {sliderValue}x
                </Typography>
                <Typography align="center" variant="body2">
                   We can put anything that we want here. This is a placeholder. This is just a 
                   placeholder text. This is just a placeholder text.
                </Typography>

                <Button
                    sx={{
                        backgroundColor: "#5723E3",
                        color: "white",
                        marginTop: "4rem",
                        display: "block",
                        padding: "0.5rem 1.5rem",
                        marginInline: "auto",
                    }}
                >
                    Navigate
                </Button>
            </Box>
        </Drawer>
    );
}

function valuetext(value: number) {
    return "" + value;
}