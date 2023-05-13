import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from '@mui/material'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { isUserLoggedIn } from "../../auth/utils";
import { API_URL } from "../../configs/endpoint";
import { handleLogout } from "../../redux/authentication";
import './styles.css'
import { setInitialData } from "../../redux/pdexam";
import InitialScreen from "./screens/initialScreen";
import PDTest from "./screens/PdTest";
import SubmitTest from "./screens/Submit";

import instance from "../../auth/jwt/useJwt";
export default function PDExam() {
    const pdexam_screen = useSelector(state => state.pdexam)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { screen, pin_id } = pdexam_screen
    
    const screens = {
        init : <InitialScreen />,
        test : <PDTest />, 
        submit : <SubmitTest />
    }
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isUserLoggedIn()) {
            setLoading(false)
            return
        }
        if (pin_id !== null) {
            setLoading(false)
            return
        
        }
        
        navigate("/login")
    })


    useEffect(() => {
        instance.get("/configs").then(res => {
            dispatch(setInitialData(res.data))
        }).catch(err => {
            console.log(err)
        })
      }, [])

    if(loading) {
        return <div></div>
    }

    return (
        <Container maxWidth="sm">
            {/* <InitialScreen /> */}
            { screens[screen] }
        </Container>
    )
}