import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { isEmpty } from "lodash";
import { Network } from "util/network";


const specialCharacterArray = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '[', ']', '{', '}', '|', ';', ':', '"', "'", '<', '>', ',', '.', '?', '/', '\\'];
const validEmailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

export function SignupDialog({ open, setOpen, ...props }: { open: boolean, setOpen: (open: boolean) => void }) {

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [accountCreationSuccessOpen, setAccountCreationSuccessOpen] = useState<boolean>(false);

    const handleClose = () => {
        setOpen(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
        setErrorMessages([]);
    };

    function validateForm() {
        let errorMessages = [];
        if (isEmpty(firstName)) {
            errorMessages.push('- First name is required');
        }
        if (isEmpty(lastName)) {
            errorMessages.push('- Last name is required');
        }
        if (isEmpty(email)) {
            errorMessages.push('- Email address is required');
        } else if (!validEmailRegex.test(email)) {
            errorMessages.push('- You must provide a valid email address');
        }

        if (isEmpty(password)) {
            errorMessages.push('- Password is required');
        } else {
            if (password.length < 8) {
                errorMessages.push('- Password must be at least 8 characters');
            }
            if (!specialCharacterArray.some(e => password.includes(e))) {
                errorMessages.push('- Password must contain at least one special character');
            }
        }

        if (isEmpty(confirmPassword)) {
            errorMessages.push('- Password confirmation is required');
        }
        else if (password !== confirmPassword) {
            errorMessages.push('- Passwords do not match');
        }

        setErrorMessages(errorMessages);
        return errorMessages.length === 0;
    }

    function triggerSignup() {
        // Validate the form before submitting.
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        let full_name = firstName + " " + lastName

        Network.signup(full_name, email, password).then(() => {
            setLoading(false);
            setAccountCreationSuccessOpen(true);
            handleClose();
        }).catch((error: any) => {
            setErrorMessages(["-" + error.message]);
            setLoading(false);
        });
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter your information below to create an account and start navigating.
                        We will never share your account information with anyone.
                    </DialogContentText>
                    <Grid container spacing={2} className='mt-3'>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                id="name"
                                label="First Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="name"
                                label="Last Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                id="name"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                id="name"
                                label="Create Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                helperText="Minimum of 8 characters. Must contain at least one special character."
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                id="name"
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    {errorMessages.length > 0 && (
                        <Alert severity="error" className='mt-4' data-testid="signupError" {...props}>
                            {errorMessages.map((error, index) => (
                                <Typography variant="body1" key={"signup" + error + index}>{error}</Typography>
                            ))}
                        </Alert>

                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="warning"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={triggerSignup}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create Account'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={accountCreationSuccessOpen}
                autoHideDuration={6000}
                onClose={() => setAccountCreationSuccessOpen(false)}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            >
                <Alert onClose={() => setAccountCreationSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Account creation successful! You may now log in with your new account.
                </Alert>
            </Snackbar>
        </>
    );
}