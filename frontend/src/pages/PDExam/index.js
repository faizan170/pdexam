import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container } from '@mui/material'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { isUserLoggedIn } from "../../auth/utils";
import { API_URL } from "../../configs/endpoint";
import { handleLogout } from "../../redux/authentication";
import './styles.css'
import AudioWaveImg from '../../assets/images/sound-wave.png'
import InitialScreen from "./screens/initialScreen";
import PDTest from "./screens/PdTest";
import SubmitTest from "./screens/Submit";
export default function PDExam() {
    const pdexam_screen = useSelector(state => state.pdexam).screen
    const screens = {
        init : <InitialScreen />,
        test : <PDTest />, 
        submit : <SubmitTest />
    }

    return (
        <Container maxWidth="sm">
            {/* <InitialScreen /> */}
            { screens[pdexam_screen] }
        </Container>
    )
}