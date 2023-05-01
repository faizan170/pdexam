import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container } from '@mui/material'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { isUserLoggedIn } from "../../auth/utils";
import { API_URL } from "../../configs/endpoint";
import { handleLogout } from "../../redux/authentication";
import instance from '../../auth/jwt/useJwt';
import AudioWaveImg from '../../assets/images/wave.png'
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ReportsTable from "./ReportsTable";
import LoadingIcon from '../../assets/images/loading.gif'

export default function Reports() {
    const [isLoading, setIsLoading] = useState(true)
    const [erroMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    const [reportsData, setReportsData] = useState([])

    const get_reports_data = () => {
        setIsLoading(true)
        instance.get(`${API_URL}/pdexam`).then(res => {
            setReportsData(res.data)
            setIsLoading(false)
        }).catch(err => {
            if (err.response?.status === 400) {
                setErrorMessage(err.response.data)
            }
            setIsLoading(false)
        })
    }

    function onDelete(delete_id) {
        
        setReportsData(reportsData.filter(report => report._id !== delete_id))
    
      }

    useEffect(() => {
        get_reports_data()
    }, [])

    return (
        <Container maxWidth="md">
            <div className="header text-center" style={{ height: 'auto' }}>
                <div style={{ paddingTop: '20px' }}>
                    <div onClick={() => navigate("/")} className="pdexam-title-m">PDExam</div>
                    
                </div>
            </div>
            {
            isLoading ? 
            <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', height: '50vh' }}>
                <div style={{ textAlign: 'center' }}><img src={LoadingIcon} /></div>
            </div> 
            :
            <ReportsTable data={reportsData} onDelete={onDelete} />}

        </Container>
    )
}