import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Box } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch, useSelector } from "react-redux";
import { setFormData, setCurrentScreen, setCurrentIndex, setTestRecording } from "../../../redux/pdexam";

import './initialScreen.css'

import Tooltip from '@mui/material/Tooltip';
import io from 'socket.io-client';
import { API_URL } from "../../../configs/endpoint";
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'

import instance from '../../../auth/jwt/useJwt';
import ProgressWithLabel from "./utils/ProgressBar";
export default function SubmitTest() {
    const dispatch = useDispatch()

    const [socket, setSocket] = useState(null)
    const formData = useSelector(state => state.pdexam)
    const { current_test_index, test_data, data } = formData
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dataPercentage, setDataPercentage] = useState(0)
    const [errorMessage, setErrorMessage] = useState("")
    const [socketResp, setSocketResp] = useState("")
    const [respUrl, setRespUrl] = useState("")

    const onSubmitClick = () => {
        var formData = new FormData()
        setSocketResp('Uploading Data')
        setIsSubmitting(true)
        setErrorMessage("")
        setRespUrl("")
        for (var test_id in data.test) {
            if (data.test[test_id].left) {
                formData.append(`${test_id}-left`, data.test[test_id].left)
            }
            if (data.test[test_id].right) {
                formData.append(`${test_id}-right`, data.test[test_id].right)
            }
        }
        formData.append('assist', data.assist)
        formData.append('medication', data.medication)
        formData.append('symptoms', data.symptoms)

        instance.post(`${API_URL}/pdexam`, formData, {
            onUploadProgress: (progressEvent) => {
                const percentage = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setDataPercentage(percentage);
                if (percentage === 100) {
                    setSocketResp('Creating Report')
                }
            },
        }).then(res => {
            console.log("Result", res)
            setRespUrl(res.data.url.replace("http:", "https:"))
            setErrorMessage("")
            setIsSubmitting(false)
        }).catch(err => {
            console.log("Error", err)
            console.log(err.response)
            console.log(err.resp)
            if (err.response?.status === 400) {
                setErrorMessage(err.response.data)
            }
            setIsSubmitting(false)
        })


    }

    useEffect(() => {
        if (socket === null) {
            console.log("ses")
            const newSocket = io(API_URL.replace("/api/v1", ""))
            setSocket(newSocket)
        }
    }, [])

    useEffect(() => {
        console.log("should connect to socket")
        if (socket !== null) {
            socket.on("connect", (data) => {
                console.log("on connect")
            })
            socket.on("processResponse", (data) => {
                console.log(data)
                //if (data.sender_id === socket.id) {
                //console.log("response")
                //}
                if (data.data.includes('%')) {
                    setDataPercentage(parseInt(data.data.replace("%", "")))
                }else{
                    setDataPercentage(100)
                }
                setSocketResp(data.data)
            })
        }
    }, [socket])

    const [tooltipOpen, setTooltipOpen] = useState(true);

    useEffect(() => {
        if (tooltipOpen) {
            const tooltipTimer = setTimeout(() => {
                setTooltipOpen(false);
            }, 3000);
            return () => {
                clearTimeout(tooltipTimer);
            };
        }
    }, [tooltipOpen]);

    const handleClick = () => {
        setTooltipOpen(true);
    };

    function handleShareClick() {
        const emailLink = `mailto:?body=${encodeURIComponent(respUrl)}`;
        window.location.href = emailLink;
      }



    return (
        <Container maxWidth="sm">
            <div className="pdexam-header text-center">
                <div className="pdexam-title">PD Exam</div>
            </div>
            <div className="pdexam-body">
                <h1 className="text-center">You have completed all tasks</h1>
                <div className="text-center" style={{ overflowX: 'hidden' }}>
                    {respUrl === "" &&
                        <Button disabled={isSubmitting} variant="contained" color="success" onClick={onSubmitClick}>
                            {isSubmitting ? (socketResp === "" ? 'Creating Report' : socketResp) : 'Press to Submit'}
                        </Button>
                    }
                    {
                        isSubmitting &&
                        <Box sx={{ width: '100%' }}>
                            <ProgressWithLabel value={dataPercentage} />
                        </Box>
                    }

                    <div>
                        {respUrl !== "" &&
                            <div>
                                <Button 
                                    startIcon={<DownloadIcon />}
                                    href={respUrl} variant="contained" color='success' download target="_blank">
                                    Download Report
                                </Button>
                                <Button style={{ marginLeft: '5px' }} 
                                    startIcon={<ShareIcon />}
                                    onClick={handleShareClick}
                                    variant="contained" color='secondary'>
                                    Share Email
                                </Button>

                                <div style={{
                                    border: '1px solid #09f',
                                    padding: '3px 6px',
                                    color: "#777",
                                    fontSize: '12px',
                                    marginTop: '20px',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>


                                    <div style={{ width: '88%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '3px' }}>
                                        {respUrl}
                                    </div>
                                    <Tooltip title="Copied!" open={tooltipOpen} placement="top">
                                        <ContentCopyIcon onClick={() => {
                                            setTooltipOpen(true)
                                            navigator.clipboard.writeText(respUrl)
                                        }} />
                                    </Tooltip>
                                </div>
                            </div>
                        }
                        {
                            errorMessage !== "" &&
                            <div style={{ color: 'brown', marginTop: '20px' }}>Error: {errorMessage}</div>
                        }
                    </div>


                </div>
            </div>
            <div className="pdexam-footer">
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', height: '100%' }}>

                    <div>
                        <Button disabled={isSubmitting} variant="contained" onClick={() => dispatch(setCurrentScreen('test'))}>Reassert to Test</Button>

                    </div>
                </div>
            </div>
        </Container>
    )
}