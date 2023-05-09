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
import { setData } from '../../redux/pdexam'
//import useJwt from '../../auth/jwt/useJwt'
import { useDispatch } from 'react-redux';
import { saveTokenToCookie } from '../../auth/utils'
import axios from 'axios';
import { API_URL } from '../../configs/endpoint';

const theme = createTheme();

export default function PinPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    setIsLoading(true)
    setErrorMessage("")

    axios.get(`${API_URL}/pin/verify?id=${data.get('pin_id')}`)
      .then(res => {
        setIsLoading(false)
        setErrorMessage('')
        dispatch(setData({
          key: 'pin_id', value: data.get('pin_id')
        }))
        console.log(res)
        navigate("/pd-exam")

      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
        if (err.response === undefined) {
          setErrorMessage("Error processing request")
        } else {
          if (err.response.status === 401 || err.response.status === 400) {
            setErrorMessage(err.response.data)
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
            Enter Pin
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="pin"
              label="Your Pin"
              name="pin_id"
              autoFocus
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
              Start Exam
            </Button>
            <Grid container>
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