import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  Container } from '@mui/material'
import { useDispatch, useSelector } from "react-redux";
import { isUserLoggedIn } from "../../auth/utils";

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

    const [apiLoading, setApiLoading] = useState(true)
    useEffect(() => {
        setApiLoading(true)
        instance.get("/configs").then(res => {
            dispatch(setInitialData(res.data))
            setApiLoading(false)
        }).catch(err => {
            console.log(err)
            setApiLoading(false)
        })
      }, [])

    if(loading) {
        return <div></div>
    }

    if (apiLoading) {
        return <div style={{
            justifyContent: 'center', display: 'flex', flexDirection: 'column', height: '100vh'
        }}>
            <div style={{ textAlign: 'center' }}>Loading</div>
        </div>
    }

    return (
        <Container maxWidth="sm">
            {/* <InitialScreen /> */}
            { screens[screen] }
        </Container>
    )
}