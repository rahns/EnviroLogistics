import '../App.css';
import React from 'react';
import { Typography, Select, FormControl, MenuItem, InputLabel } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";

function calculateMonthStats(trips, month, year) {
    var max = 0;
    var min = trips.length === 0 ? 0 : Number.POSITIVE_INFINITY;
    var total = 0;
    for (let i = 0; i < trips.length; i++) {
        if (trips[i].date.getMonth() === month && trips[i].date.getFullYear() === year.getFullYear()) {
            total += trips[i].emissions;
            max = Math.max(max, trips[i].emissions);
            min = Math.min(min, trips[i].emissions);
        }
    }
    var avg = Math.round(total/30);
    return [total, avg, max, min]
}

export default function Report(props) {
    const [selectedYear, setYear] = React.useState(new Date());
    const [selectedMonth, setMonth] = React.useState(12);
    const [avg, setAvg] = React.useState(0);
    const [max, setMax] = React.useState(0);
    const [min, setMin] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const trips = props.trips;
    React.useEffect(() => {
        if (selectedMonth === 12) {  // If all months is selected
            let [max, min, total] = [0,Number.POSITIVE_INFINITY,0];
            for (let i = 0; i < 12; i++) {
                let [mtotal] = calculateMonthStats(trips, i, selectedYear);
                total += mtotal;
                max = Math.max(max, mtotal);
                if (mtotal !== 0) min = Math.min(min, mtotal);
            }
            var avg = Math.round(total/12);
            setAvg(avg);
            setMax(max);
            setMin(min === Number.POSITIVE_INFINITY ? 0 : min);
            setTotal(total);
        }
        else {
            const [total, avg, max, min] = calculateMonthStats(trips, selectedMonth, selectedYear);
            setAvg(avg);
            setMax(max);
            setMin(min === Number.POSITIVE_INFINITY ? 0 : min);
            setTotal(total);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMonth, selectedYear, trips]);
    return (
        <>
            <div style={{marginBottom: 10}}>
                <div className="row">
                    <FormControl variant="outlined" >
                        <InputLabel>Month</InputLabel>
                        <Select
                        value={selectedMonth}
                        onChange={(e) => setMonth(e.target.value)}
                        label="Month"
                        >
                            <MenuItem value={12}>All Months</MenuItem>
                            <MenuItem value={0}>January</MenuItem>
                            <MenuItem value={1}>February</MenuItem>
                            <MenuItem value={2}>March</MenuItem>
                            <MenuItem value={3}>April</MenuItem>
                            <MenuItem value={4}>May</MenuItem>
                            <MenuItem value={5}>June</MenuItem>
                            <MenuItem value={6}>July</MenuItem>
                            <MenuItem value={7}>August</MenuItem>
                            <MenuItem value={8}>September</MenuItem>
                            <MenuItem value={9}>October</MenuItem>
                            <MenuItem value={10}>November</MenuItem>
                            <MenuItem value={11}>December</MenuItem>
                        </Select>
                    </FormControl>
                    <DatePicker
                    variant="inline"
                    inputVariant="outlined"
                    views={["year"]}
                    label="Year"
                    value={selectedYear}
                    onChange={setYear}
                    />
                </div>
            </div>
            <div className="fillRow">
                <Statistic title={'Average per '+ (selectedMonth === 12 ? 'Month' : 'Day') + ':'} value={avg < 1000 ? avg + "g" : Math.round((avg/1000) * 10) / 10 + "kgs"}/>
                <Statistic title={(selectedMonth === 12 ? 'Highest Month ' : 'Max Emissions in a Day') + ':'} value={max < 1000 ? max + "g" : Math.round((max/1000) * 10) / 10 + "kgs"}/>
                <Statistic title={(selectedMonth === 12 ? 'Lowest (Active) Month ' : 'Min Emissions in an (Active) Day') + ':'} value={min < 1000 ? min + "g" : Math.round((min/1000) * 10) / 10 + "kgs"}/>
                <Statistic title='Total Emissions: ' value={total < 1000 ? total + "g" : Math.round((total/1000) * 10) / 10 + "kgs"}/>
            </div>
        </>
    )
}

function Statistic(props) {
    return (
        <div className="divBox" style={{width: "20%", minHeight: 80, boxShadow: "none"}}>
            <Typography variant="body2"><b>{props.title}</b></Typography>
            <Typography color='primary' variant="h5" style={{color:"#8884d8"}}><b>{props.value}</b></Typography>
        </div>
    )
}