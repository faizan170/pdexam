import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { io } from "socket.io-client";
export default function PDExam() {
    const pdexam_screen = useSelector(state => state.pdexam)
    console.log(isUserLoggedIn())
    const navigate = useNavigate()
    const { screen, pin_id } = pdexam_screen
    const [socket, setSocket] = useState(null)
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


    // useEffect(() => {
    //     if (socket === null) {
    //         console.log("ses")
    //       const newSocket = io(API_URL.replace("/api/v1", ""))
    //       setSocket(newSocket)
    //     }
    //   }, [])

    // useEffect(() => {
    //     if (socket !== null) {
    //         console.log("should connect to socket")
    //       socket.on("connect", (data) => {
    //         console.log("on connect")
    //       })
    //       socket.on("processResponse", (data) => {
    //         console.log(data)
    //         //if (data.sender_id === socket.id) {
    //         //console.log("response")
    //         //}
    //         // if (data.data.includes('%')){
    //         //     setDataPercentage(data.data)
    //         // }
    //       })
    //     }
    //   }, [socket])

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