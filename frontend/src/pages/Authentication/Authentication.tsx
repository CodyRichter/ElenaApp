import React from 'react';
import { Typography } from "@mui/material";

export default function Authentication({ setToken }: { setToken: (token: string) => void }) {
    return (
        <div>
            <Typography variant="h1">Authentication</Typography>
        </div>
    )
}