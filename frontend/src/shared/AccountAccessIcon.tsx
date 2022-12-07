import { Logout, Person, History } from "@mui/icons-material";
import { Alert, Backdrop, Box, Fab, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { isEmpty } from "lodash";
import { useState } from "react";
import { NavigationHistory } from "./NavigationHistory";

const floatStyle = {
    position: 'fixed',
    left: 'auto',
    bottom: 'auto',
    top: 25,
    right: 25,
    margin: 0,
};

export function AccountAccessIcon({ token, setToken, ...props }: { token: string | null, setToken: (token: string) => void }) {

    const [menuOpen, setMenuOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const handleOpen = () => setMenuOpen(true);
    const handleClose = () => setMenuOpen(false);

    const actions = [
        { icon: <History />, name: 'History', action: () => { setHistoryOpen(true); } },
        { icon: <Logout />, name: 'Logout', action: () => { setToken(''); } },
    ];

    return (

        <Box>
            <Backdrop open={menuOpen} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={floatStyle}
                icon={<Person />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={menuOpen}
                direction='down'
                color="primary"
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={() => {
                            action.action();
                            handleClose();
                        }}
                    />
                ))}
            </SpeedDial>
            {historyOpen &&
                <NavigationHistory open={historyOpen} setOpen={setHistoryOpen} token={token} />
            }
        </Box>
    );

}