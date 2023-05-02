import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

import { handleLogin } from '../../redux/authentication'
import { setUser } from '../../redux/user'
//import useJwt from '../../auth/jwt/useJwt'
import { useDispatch } from 'react-redux';
import { saveTokenToCookie } from '../../auth/utils'
import axios from 'axios';
import { API_URL } from '../../configs/endpoint';

const theme = createTheme();

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    setIsLoading(true)
    setErrorMessage("")

    axios.post(`${API_URL}/login`, { email: data.get('email'), password: data.get('password') })
      .then(res => {
        setIsLoading(false)
        setErrorMessage('')
        console.log(res.data)

        const data = {
          ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken, tokenExpiresIn: res.data.tokenExpiresIn,
          refreshExpiresIn: res.data.refreshExpiresIn, id: res.data.id
        }

        // Set to cookies
        saveTokenToCookie(res.data.accessToken)

        dispatch(handleLogin(data))
        
        dispatch(setUser({
          id: res.data.id,
          full_name: res.data.fullName,
          username: res.data.username,
          role: res.data.role
        }))
        //ability.update(res.data.userData.ability)
        navigate("/")

      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
        if (err.response === undefined) {
          setErrorMessage("Error processing request")
        } else {
          if (err.response.status === 409) {
            setErrorMessage(err.response.data.error)
          } else {
            setErrorMessage("Error processing request")
          }
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              errorMessage !== "" && <p style={{ color: 'red', marginBottom: 0, marginTop: 0 }}>{errorMessage}</p>
            }
            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}