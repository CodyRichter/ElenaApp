import React from 'react';
import { Box } from "@mui/material";
import Map from "./Map/Map";
import Sidebar from "./Layout/Sidebar";


export default function Navigation() {
    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                overflow: "hidden",
                maxHeight: "100vh",
            }}
        >
            <Sidebar />
            <Map data={data} />
        </Box>
    );
}

// This is just for testing. This can be the JSON data that is being sent from the backend. i.e. the co-ordinates
const data = [
    {
        from_lat: 13.96691,
        from_long: 77.74935,
        to_lat: 12.92768,
        to_long: 77.62664,
    },
];