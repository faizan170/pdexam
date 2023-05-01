import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container } from '@mui/material'
import { useDispatch, useSelector } from "react-redux";

import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { setFormData, setCurrentScreen, setCurrentIndex, setTestRecording } from "../../../redux/pdexam";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import MicIcon from '@mui/icons-material/Mic';
import './pdtest.css'
import VideoDialog from "./utils/VideoDialog";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import LinearProgress from '@mui/material/LinearProgress';

export default function PDTest() {
    const dispatch = useDispatch()
    const formData = useSelector(state => state.pdexam)
    const { current_test_index, test_data, data } = formData
    const test_recordings = data.test[test_data[current_test_index].id]
    const recorderControls = useAudioRecorder();
    const {
        startRecording,
        stopRecording,
        isRecording,
        recordingTime,
    } = recorderControls
    //console.log(test_recordings)
    const [recordState, setRecordState] = useState({
        recordType: '', state: 'idle'
    })
    const [modalOpen, setModalOpen] = useState(false)
    const [countDown, setCountDown] = useState(3)
    const [audioURL, setAudioURL] = useState({
        left: '', right: ''
    });


    useEffect(() => {
        var leftUrl = ''
        var rightUrl = ''
        if (test_recordings.left) {
            leftUrl = URL.createObjectURL(test_recordings.left)
        }
        if (test_recordings.right) {
            rightUrl = URL.createObjectURL(test_recordings.right)
        }
        setAudioURL({ left: leftUrl, right: rightUrl })

    }, [current_test_index])

    const addAudioElement = (blob) => {
        console.log("finish")
        setAudioURL({ ...audioURL, [recordState.recordType]: URL.createObjectURL(blob) });
        dispatch(setTestRecording({ id: test_data[current_test_index].id, type: recordState.recordType, data: blob }))

        setRecordState({ type: '', state: 'idle' })
        //setAudioUrl([...audioURL, URL.createObjectURL(blob)])
    };


    const handleStartRecording = async (type) => {
        //setRecordType(type)
        setRecordState({ recordType: type, state: 'countdown' })
        const intervalId = setInterval(() => {
            setCountDown((prevCount) => prevCount - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            setRecordState({ recordType: type, state: 'recording' })
            startRecording()

        }, 3000);

        return () => clearInterval(intervalId);
    };

    useEffect(() => {
        if (recordingTime > 10) {
            stopRecording()
            setCountDown(3)
        }
    }, [recordingTime])



    const onNextClick = () => {
        if (current_test_index + 1 === test_data.length) {
            dispatch(setCurrentScreen('submit'))
        } else {
            dispatch(setCurrentIndex(formData.current_test_index + 1))
        }
    }

    const get_button_text = (type) => {
        //console.log(recordState)
        if (type === 'right') {
            if (recordState.recordType === 'right') {
                if (recordState.state === 'countdown') {
                    return `Preparing to Record`
                } else if (recordState.state === 'recording') {
                    return `Recording Now`
                }
            } else {
                return `Record Right ${test_data[current_test_index].type}`
            }
        } else if (type === 'left') {
            
            if (recordState.recordType === 'left') {
                if (recordState.state === 'countdown') {
                    return `Preparing to Record`
                } else if (recordState.state === 'recording') {
                    return `Recording Now`
                }
            } else {
                return `Record Left ${test_data[current_test_index].type}`
            }
        }
    }

    const counter = () => {
        if (recordState.state === 'countdown') {
            return `${countDown}`
        } else if (recordState.state === 'recording') {
            return `${recordingTime}`
        }
    }


    return (
        <Container maxWidth="sm">
            <LinearProgress variant="determinate" style={{ marginTop: '3px' }} value={(current_test_index/10)*100} />
            <div className="pdexam-header text-center">
                <div className="pdexam-title">Test {current_test_index + 1} - {test_data[current_test_index].title}</div>
            </div>
            <div className="pdexam-body">

                <div className="text-center pdexam-instruction-container">
                    <h2 style={{ marginTop: '0px' }}>Instructions</h2>
                    <OndemandVideoIcon sx={{ fontSize: 80, cursor: 'pointer' }} color="primary" onClick={() => setModalOpen(true)} />
                </div>
                <div style={{ height: '100%', justifyContent: 'center', flexDirection: 'column', display: 'flex' }}>
                    <div className="text-center">

                        <div style={{ visibility: 'hidden', position: 'fixed' }}>
                            <AudioRecorder onRecordingComplete={addAudioElement} recorderControls={recorderControls} />
                        </div>


                        <div style={{ padding: '10px' }} >

                            { ['countdown', 'recording'].includes(recordState.state) && recordState.recordType === 'right' &&
                                <div className="countdown-container" style={{ backgroundColor: isRecording && '#07F' }}>
                                    <div className="countdown-text">{ counter() }</div>
                                </div>
                            }

                            {audioURL.right && <audio src={audioURL.right} controls />}
                            <Button variant="contained"
                                startIcon={<MicIcon />}
                                style={{ margin: '10px auto', minWidth: '200px' }}
                                onClick={() => handleStartRecording('right')}
                                disabled={['countdown', 'recording'].includes(recordState.state)}>
                                {get_button_text('right')}

                            </Button>

                        </div>
                        <div style={{ padding: '10px' }} >
                        { ['countdown', 'recording'].includes(recordState.state) && recordState.recordType === 'left' &&
                                <div className="countdown-container" style={{ backgroundColor: isRecording && '#07F' }}>
                                    <div className="countdown-text">{ counter() }</div>
                                </div>
                            }
                            {audioURL.left && <audio src={audioURL.left} controls />}
                            <Button variant="contained" color="primary"
                                startIcon={<MicIcon />}
                                disabled={['countdown', 'recording'].includes(recordState.state)}
                                style={{ margin: '10px auto' }}
                                onClick={() => handleStartRecording('left')}>
                                {/* Record Left {test_data[current_test_index].type} */}
                                {get_button_text('left')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pdexam-footer">
                <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px' }}>
                        <Button variant="contained"
                            startIcon={<KeyboardArrowLeftIcon />}
                            disabled={current_test_index === 0}
                            onClick={() => dispatch(setCurrentIndex(formData.current_test_index - 1))}>Previous</Button>

                        <Button variant="contained" onClick={onNextClick} disabled={isRecording} endIcon={<KeyboardArrowRightIcon />}>Next</Button>
                    </div>
                </div>
                <VideoDialog open={modalOpen} setOpen={() => setModalOpen(false)} />
            </div>
        </Container>
    )
}