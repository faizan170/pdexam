import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container } from '@mui/material'
import { useDispatch, useSelector } from "react-redux";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { setFormData, setCurrentScreen } from "../../../redux/pdexam";
import Slider from '@mui/material/Slider';
import './initialScreen.css'
import RadioComp from "./FormComponents/RadioComp";
import RangeComp from "./FormComponents/RangeComp";

export default function InitialScreen() {
    const dispatch = useDispatch()
    const pdExamForm = useSelector(state => state.pdexam)
    const formData = pdExamForm.data
    const questions = pdExamForm.questions
    const onChangeRadio = (e) => {
        dispatch(setFormData({ key: e.target.name, value: e.target.value }))
    }
    
    const renderQuestion = (question, q_index) => {
        if (question.type === 'radio')
            return <RadioComp question={question} onChangeRadio={onChangeRadio} key={`question-${q_index}`} index={q_index} />
        else
            return <RangeComp question={question} onChangeRadio={onChangeRadio} key={`question-${q_index}`} index={q_index} />
    }

    return (
        <Container maxWidth="sm">
            <div className="pdexam-header text-center">
                <div className="pdexam-title">PDExam</div>
            </div>
            <div className="pdexam-body">
                <p className="text-center" style={{ paddingBottom: '10px' }}>Please answers the following questions</p>
                <div style={{ justifyContent: 'center', flexDirection: 'column', display: 'flex' }}>
                    <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                        {/* <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Is someone assisting you with performing this test?</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue=""
                                name="assist"
                                onChange={onChangeRadio}
                            >
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No, I am doing the test alone" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl style={{ marginTop: '15px' }}>
                            <FormLabel id="demo-radio-buttons-group-label">When was the last dose of your PD medications?</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue=""
                                name="medication"
                                onChange={onChangeRadio}
                            >
                                <FormControlLabel value="none" control={<Radio />} label="I have not taken any meds today" />
                                <FormControlLabel value="1-3 hours" control={<Radio />} label="About 1 to 3 hours ago" />
                                <FormControlLabel value="4 or 4+ hours" control={<Radio />} label="About 4 hours ago or more" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl style={{ marginTop: '15px' }}>
                            <FormLabel id="demo-radio-buttons-group-label">How would you rate your PD symptoms as this time?<br />
                                (rate from 0 to 10; 0 being no significant symptoms, 10 being significant symptoms, feeling off)
                            </FormLabel>
                            <Slider
                                style={{ margin: '25px 0px' }}
                                aria-label="symptoms"
                                defaultValue={0}
                                name="symptoms"
                                onChange={onChangeRadio}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={1}
                                marks={marks}
                                min={0}
                                max={10}
                            />
                        </FormControl> */}
                        {
                            questions.map((question, q_index) => {
                                return (
                                   <div key={`qq-${q_index}`}> {renderQuestion(question, q_index)}</div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="pdexam-footer">
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', height: '100%' }}>
                    <div className="text-center">
                        <Button variant="contained" onClick={() => dispatch(setCurrentScreen('test'))}>Start the Test</Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}