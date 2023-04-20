import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { API_URL } from '../../configs/endpoint';
import { useNavigate } from 'react-router-dom';



const theme = createTheme();

export default function SignIn() {
    const [requestStatus, setRequestStatus] = useState({
        isLoading: false, errorMessage: ""
    })
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        setRequestStatus({ errorMessage: '', isLoading: true })
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        axios.post(`${API_URL}/register`, {
            name: data.get("name"),
            email: data.get('email'),
            password: data.get('password')
        }).then(res => {
            navigate("/login")
            setRequestStatus({ ...requestStatus, isLoading: false })
        }).catch(err => {
            console.log(err)

            if ([409, 400].includes(err.response?.status)) {
                setRequestStatus({ errorMessage: err.response.data.error, isLoading: false })
            } else {

                setRequestStatus({ errorMessage: 'Error processing request', isLoading: false })
            }
        })
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        {
                            requestStatus.errorMessage !== "" && <p style={{ color: 'red', marginBottom: 0, marginTop: 0 }}>{requestStatus.errorMessage}</p>
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={requestStatus.isLoading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {requestStatus.isLoading ? 'Processing...' : 'Sign Up'}
                        </Button>
                        <Grid container>
                            {/* <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid> */}
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}