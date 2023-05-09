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

export default function InitialScreen() {
    const dispatch = useDispatch()
    const formData = useSelector(state => state.pdexam).data
    const onChangeRadio = (e) => {
        dispatch(setFormData({ key: e.target.name, value: e.target.value }))
    }
    function valuetext(value) {
        return `${value}°C`;
      }

      const marks = [
        {value: 0, label: '0'},
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 4, label: '4'},
        {value: 5, label: '5'},
        {value: 6, label: '6'},
        {value: 7, label: '7'},
        {value: 8, label: '8'},
        {value: 9, label: '9'},
        {value: 10, label: '10'},
        
      ];
    return (
        <Container maxWidth="sm">
            <div className="pdexam-header text-center">
                <div className="pdexam-title">PDExam</div>
            </div>
            <div className="pdexam-body">
                <p className="text-center" style={{ paddingBottom: '10px' }}>Please answers the following questions</p>
                <div style={{ justifyContent: 'center', flexDirection: 'column', display: 'flex' }}>
                    <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                        <FormControl>
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
                        </FormControl>
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