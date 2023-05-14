import React from "react";

import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
export default function RangeComp(props) {
    const { title, id, min, max, marks } = props.question
    return (
        <FormControl style={{ marginTop: '15px', width: '100%' }}>
            <FormLabel id="demo-radio-buttons-group-label">{props.index+1}. {title}
            </FormLabel>
            <Slider
                style={{ margin: '25px 0px' }}
                aria-label="symptoms"
                defaultValue={0}
                name={id}
                onChange={props.onChangeRadio}
                valueLabelDisplay="auto"
                step={1}
                marks={marks}
                min={min}
                max={max}
            />
        </FormControl>
    )
}