import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { get, isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { Network } from "util/network";


export function NavigationHistory({ open, setOpen, token, ...props }: { token: string | null, open: boolean, setOpen: (open: boolean) => void }) {

    const [navigationHistory, setNavigationHistory] = useState([] as any[]);
    const [error, setError] = useState('');


    useEffect(() => {
        Network.navHistory(token as string).then((res) => {
            setNavigationHistory(res);
            setError('');
        }).catch((err) => {
            setError(err.message);
        });
    }, []);

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
        >
            <DialogTitle>
                Navigation History
            </DialogTitle>
            <DialogContent>
                {error && <Alert severity="error">{error}</Alert>}
                {isEmpty(error) && !isEmpty(navigationHistory) &&
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Origin</TableCell>
                                    <TableCell>Destination</TableCell>
                                    <TableCell>Distance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {navigationHistory.map((hist) => (
                                    <TableRow
                                        key={get(hist, 'origin_name') + get(hist, 'destination_name')}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{get(hist, 'origin_name')}</TableCell>
                                        <TableCell>{get(hist, 'destination_name')}</TableCell>
                                        <TableCell>{get(hist, 'distance')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

