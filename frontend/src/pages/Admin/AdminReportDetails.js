import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Container, Grid, Typography } from '@mui/material'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../configs/endpoint";
import instance from '../../auth/jwt/useJwt';
import LoadingIcon from '../../assets/images/loading.gif'
import { useParams } from 'react-router';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import Avatar from '@mui/material/Avatar';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';


export default function AdminReportDetails() {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const match = useParams();

    const [erroMessage, setErrorMessage] = useState("")

    const [reportsData, setReportsData] = useState({})

    const get_reports_data = () => {
        setIsLoading(true)
        instance.get(`${API_URL}/pdexam?report_id=${match.id}`).then(res => {
            console.log(res.data)
            setReportsData(res.data)
            setIsLoading(false)
        }).catch(err => {
            if (err.response?.status === 400) {
                setErrorMessage(err.response.data)
            }
            setIsLoading(false)
        })
    }

    useEffect(() => {
        get_reports_data()
    }, [])

    function handleShareClick() {
        const emailLink = `mailto:?body=${encodeURIComponent(reportsData.url)}`;
        window.location.href = emailLink;
    }

    return (
        <Container maxWidth="md">
            <div className="header text-center" style={{ height: 'auto' }}>
                <div style={{ paddingTop: '20px' }}>
                    <div className="pdexam-title-m">PDExam</div>

                </div>
            </div>
            {
                isLoading ?
                    <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', height: '50vh' }}>
                        <div style={{ textAlign: 'center' }}><img src={LoadingIcon} /></div>
                    </div>
                    :
                    (
                        Object.keys(reportsData).length === 0 ?
                            <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', height: '50vh' }}>
                                <div style={{ textAlign: 'center' }}>No Data found</div>
                            </div>
                            :
                            <Card>
                                <CardHeader
                                    avatar={
                                        <Avatar onClick={() => navigate("/admin")} style={{ cursor: 'pointer' }}>
                                            <KeyboardArrowLeftIcon />
                                        </Avatar>
                                    }
                                    title={reportsData._id}
                                    subheader={reportsData.created_at}
                                />
                                <CardContent>
                                    <div>
                                        <Button style={{ marginTop: '5px', marginRight: '5px' }}
                                            startIcon={<DownloadIcon />}
                                            href={reportsData.url} variant="contained" color='success' download target="_blank">
                                            Download Report
                                        </Button>
                                        <Button style={{ marginTop: '5px' }}
                                            startIcon={<ShareIcon />}
                                            onClick={handleShareClick}
                                            variant="contained" color='secondary'>
                                            Share
                                        </Button>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <Typography variant="h6" color='primary' style={{ marginTop: '5px', marginBottom: '5px' }}>
                                            Audio Files ({reportsData.audio?.length})
                                        </Typography>

                                        {
                                            reportsData.audio.map((audio_pair, audio_index) => {
                                                return (
                                                    <Grid key={`pair-${audio_index}`} container spacing={2} style={{ marginBottom: '10px', }}>
                                                        <Grid item sm={6} sx={12}>
                                                            <Card style={{ display: 'flex', minWidth: '260px', justifyContent: 'space-between', padding: '10px', border: '1px solid #ccc' }}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <AudioFileIcon color="secondary" />
                                                                    <div style={{ color: "#444" }}>
                                                                        {audio_pair.left.split("/").pop()}
                                                                    </div>
                                                                </div>
                                                                <a href={audio_pair.left} download target="_blank"><DownloadIcon color="primary" /></a>
                                                            </Card>
                                                        </Grid>
                                                        <Grid item sm={6} sx={12}>
                                                            <Card style={{ display: 'flex', minWidth: '260px', justifyContent: 'space-between', padding: '10px', border: '1px solid #ccc' }}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <AudioFileIcon color="secondary" />
                                                                    <div style={{ color: "#444" }}>
                                                                        {audio_pair.right.split("/").pop()}
                                                                    </div>
                                                                </div>
                                                                <a href={audio_pair.right} download target="_blank"><DownloadIcon color="primary" /></a>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </div>
                                </CardContent>
                            </Card>


                    )
            }

        </Container>
    )
}