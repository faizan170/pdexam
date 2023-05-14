import React from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RadioComp(props) {
    const { title, id, values } = props.question
    
    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">{props.index+1}. { title }</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue=""
                name={id}
                onChange={props.onChangeRadio}
            >
                {values.map((item, index) => {
                    return (
                        <FormControlLabel key={`radio-${id}-${index}`} value={item.value} control={<Radio />} label={item.label} />
                    )
                })
                }
            </RadioGroup>
        </FormControl>
    )
}