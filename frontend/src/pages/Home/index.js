import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container } from '@mui/material'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { isUserLoggedIn } from "../../auth/utils";
import { API_URL } from "../../configs/endpoint";
import { handleLogout } from "../../redux/authentication";
import './styles.css'
import AudioWaveImg from '../../assets/images/wave.png'
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Home() {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    if (isUserLoggedIn()) {
        return (
            <Container maxWidth="sm">
                <div className="header text-center">
                    <div style={{ paddingTop: '20px' }}>
                        <div className="pdexam-title">PDExam</div>
                        <img src={AudioWaveImg} style={{ height: '100px', width: '300px', marginTop: '10px' }} />
                    </div>
                </div>
                <div className="text-center main-body">
                    <div style={{ height: '100%', justifyContent: 'center', flexDirection: 'column', display: 'flex' }}>
                        <div>
                            <h2 style={{ marginBottom: '20px' }}>Welcome Back <span className="text-primary">{user.fullname}</span></h2>
                            <Button variant="contained" onClick={() => dispatch(handleLogout())} startIcon={<LogoutIcon/>}>Logout</Button>
                            <div>
                            <Button style={{ marginTop: '20px' }} variant="contained" component={Link} to="/pd-exam" color="secondary">Start Exam</Button>
                            </div></div>
                    </div>
                </div>
                <div className="main-footer">
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', height: '100%' }}>
                        <div className="text-center"><a href="/">About PDExam</a></div>
                    </div>
                </div>
            </Container>
        )
    }


    return (
        <Container maxWidth="sm">
            <div className="header text-center">
            <div style={{ paddingTop: '20px' }}>
                        <div className="pdexam-title" style={{ fontSize: '40px' }}>PDExam</div>
                        <img src={AudioWaveImg} style={{ height: '100px', width: '300px', marginTop: '10px' }} />
                    </div>
            </div>
            <div className="text-center main-body">
                <div style={{ height: '100%', justifyContent: 'center', flexDirection: 'column', display: 'flex' }}>

                    <div style={{ marginBottom: '40px' }}>
                        <Button component={Link} to="/login" variant="outlined" startIcon={<LoginIcon />}>Login</Button>
                        <p style={{ margin: 2 }}>New/Existing user login now</p>
                    </div>
                    <div>
                        <Button component={Link} to="/register" variant="outlined" startIcon={<LoginIcon />}>Sign Up</Button>
                        <p style={{ margin: 2 }}>New users</p>
                    </div>
                </div>
            </div>
            <div className="main-footer">
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', height: '100%' }}>
                    <div className="text-center"><a href="/">About PDExam</a></div>
                </div>
            </div>
        </Container>
    )
}