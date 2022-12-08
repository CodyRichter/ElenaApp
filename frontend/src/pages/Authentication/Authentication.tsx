import React from 'react';
import {
    Alert,
    Button,
    Card,
    CardContent,
    CardMedia,
    TextField,
    Grid,
    Typography
} from "@mui/material";
import ElenaLogo from 'assets/images/elena-logo.png';
import { Network } from 'util/network';
import isEmpty from 'lodash/isEmpty';
import { useNavigate } from 'react-router-dom';
import { SignupDialog } from 'pages/Authentication/SignupDialog';


export default function Authentication(
    { setToken }: { setToken: (token: string) => void }
) {

    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const [signupOpen, setSignupOpen] = React.useState<boolean>(false);


    const navigate = useNavigate();

    const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    async function triggerLogin() {
        if (isEmpty(username) || isEmpty(password)) {
            setError('Please enter a username and password');
            return;
        }

        Network.login(username, password).then((token) => {
            setUsername('');
            setPassword('');
            setError('');
            setToken(token);
            navigate('/navigate');
        }).catch((error: any) => {
            setError(error.message);
        });
    };


    return (
        <>
            <Grid
                container
                alignItems="flex-start"
                direction="row"
                justifyContent="center"
                style={{ minHeight: '100vh', backgroundColor: 'transparent' }}
            >
                <Grid item xs={12} sm={8} md={4} lg={3} xl={2} className={'mt-4'}>
                    <CardMedia
                        component="img"
                        image={ElenaLogo}
                        alt="EleNa Logo"
                        style={{ marginBottom: '3em', marginTop: '3em' }}
                    />
                    <Card className='pt-2 pb-2 px-4'>

                        <CardContent style={{ padding: '1em' }}>
                            <Typography component="div" variant='h6' className='mb-4' id="loginTitle">
                                Login
                            </Typography>

                            <TextField
                                inputProps={{ "data-testid": "loginEmail" }}
                                label="Email Address"
                                variant="outlined"
                                type="email"
                                fullWidth
                                className='mb-4'
                                onChange={updateUsername}
                                onKeyUp={(e) => e.key === 'Enter' && triggerLogin()}
                            />
                            <TextField
                                inputProps={{ "data-testid": "loginPassword" }}
                                label="Password"
                                variant="outlined"
                                type="password"
                                fullWidth
                                className='mb-4'
                                onChange={updatePassword}
                                onKeyUp={(e) => e.key === 'Enter' && triggerLogin()}
                            />
                            <Button color='primary' variant='contained' disableElevation fullWidth onClick={triggerLogin} data-testid="loginButton">
                                Sign in
                            </Button>

                            <Button color='primary' variant='contained' disableElevation fullWidth onClick={() => setSignupOpen(true)} data-testid="signupButton" className="mt-3">
                                Create Account
                            </Button>

                            {!isEmpty(error) && (
                                <Alert severity="error" className='mt-4' data-testid="loginError">
                                    {error}
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <SignupDialog open={signupOpen} setOpen={setSignupOpen} />
        </>
    )
}