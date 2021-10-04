import React from 'react';
import '../App.css';
import { DateTimePicker } from "@material-ui/pickers";
import { Button, TextField } from "@material-ui/core";


export default function ExtraDetails() {
    //details page constants
    const [selectedDate, handleDateChange] = React.useState(new Date());

    return (
        <div>
            <DateTimePicker
                autoOk
                ampm={false}
                disablePast
                value={selectedDate}
                onChange={handleDateChange}
                label="Date/Time"
                showTodayButton
            />

            <TextField
                id="outlined-multiline-static"
                label="Notes"
                multiline
                rows={4}
                defaultValue="Add extra info here"
                variant="outlined"
            />

            <Button variant="contained" color="secondary" onClick={() => void 0}>Switch mode</Button>
        </div>
    )
}
