import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, Container } from '@mui/material'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { isUserLoggedIn } from "../../auth/utils";
import { API_URL } from "../../configs/endpoint";
import { handleLogout } from "../../redux/authentication";
import instance from '../../auth/jwt/useJwt';
import AudioWaveImg from '../../assets/images/wave.png'
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Reports from "./pages/Reports";
import LoadingIcon from '../../assets/images/loading.gif'
import UsersPage from "./pages/Users";

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [erroMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    const [adminData, setAdminData] = useState({
        users: [], reports: []
    })

    const get_reports_data = () => {
        setIsLoading(true)
        instance.get(`${API_URL}/admin`).then(res => {
            console.log(res.data)
            setAdminData(res.data)
            setIsLoading(false)
        }).catch(err => {
            if (err.response?.status === 400) {
                setErrorMessage(err.response.data)
            }
            setIsLoading(false)
        })
    }

    function onDelete(delete_id) {
        setAdminData({ ...adminData, reports: adminData.reports.filter(report => report._id !== delete_id) })

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
                    <div>
                        <Card style={{ marginTop: '20px' }}>
                            <CardHeader title={`Reports (${adminData.reports?.length})`} subheader='PDExam reports' />
                            <CardContent>
                                <Reports data={adminData.reports} onDelete={onDelete} />
                            </CardContent>
                        </Card>
                        <Card style={{ marginTop: '20px' }}>
                            <CardHeader title={`Users (${adminData.users?.length})`} subheader='All registered Users List' />
                            <CardContent>
                            <UsersPage data={adminData.users} />
                            </CardContent>
                        </Card>
                    </div>
            }

        </Container>
    )
}