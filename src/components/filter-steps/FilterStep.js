import { useEffect, useState } from "react"

import TextField from '@mui/material/TextField';
import { MenuItem, Select, Switch } from "@mui/material";

const TEXT_ALIGNMENT = {
    sx: {
        "& input": {
            textAlign: "center"
        }
    }
}

function getFilterFunction(type) {
    switch (type) {
        case "contains":
            return (input, value) => input.includes(value)
        case "equals":
            return (input, value) => input === value
        case "matches":
            return (input, value) => {
                const regex = new RegExp(value, 'ig')
                return regex.test(input)
            }
        case "starts_with":
            return (input, value) => input.startsWith(value)
        case "ends_with":
            return (input, value) => input.endsWith(value)
        default:
            throw new Error("not supported filter type")
    }
}

export function GeneralFilterStep({ setTransformer, disabled, setTitle }) {

    const [value, setValue] = useState('')
    const [trueOrFalse, setTrueOrFalse] = useState(true)
    const [filterType, setFilterType] = useState('equals')

    useEffect(() => {
        setTitle("Text filter")
        setTransformer(() => (input) => {
            const filterFunction = getFilterFunction(filterType)
            if (trueOrFalse) {
                if (filterFunction(input, value)) {
                    return input;
                }
                else {
                    return null;
                }
            } else {
                if (filterFunction(input, value)) {
                    return null;
                }
                else {
                    return input;
                }
            }

        })
    }, [value, trueOrFalse, filterType, setTitle, setTransformer])

    return <>
        <div style={{ display: "flex", flexWrap: "nowrap", height: "100%", alignItems: "center"}} className="toggle-holder">
            <span>Positive filter</span>
            <Switch checked={trueOrFalse}
                onChange={() => setTrueOrFalse((current) => !current)}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </div>
        <Select
            sx={{ m: 1, minWidth: 120 }}
            variant="standard"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Type"
        >
            <MenuItem value={"equals"}>Equals</MenuItem>
            <MenuItem value={"contains"}>Contains</MenuItem>
            <MenuItem value={"matches"}>Matches</MenuItem>
            <MenuItem value={"starts_with"}>Starts with</MenuItem>
            <MenuItem value={"ends_with"}>Ends with</MenuItem>
        </Select>
        <TextField type="text" label="Text" InputProps={TEXT_ALIGNMENT} style={{ width: "30%" }}
            size="small" value={value} onChange={(event) => setValue(event.target.value)} disabled={disabled} />
    </>

}

export function JsonFilterStep({ setTransformer, disabled, setTitle }) {

    const [fieldName, setFieldName] = useState('')
    const [value, setValue] = useState('')
    const [trueOrFalse, setTrueOrFalse] = useState(true)
    const [filterType, setFilterType] = useState('equals')

    useEffect(() => {
        setTitle("Json filter")
        setTransformer(() => (input) => {
            
            let fieldValue = null;
            try {
                const jsonInput = JSON.parse(input)
                fieldValue = jsonInput[fieldName]
            } catch {
                return null
            }
            
            const filterFunction = getFilterFunction(filterType)
            if (trueOrFalse) {
                if (filterFunction(fieldValue, value)) {
                    return input;
                }
                else {
                    return null;
                }
            } else {
                if (filterFunction(fieldValue, value)) {
                    return null;
                }
                else {
                    return input;
                }
            }

        })
    }, [value, trueOrFalse, filterType, fieldName, setTitle, setTransformer])

    return <>
        <div style={{ display: "flex", flexWrap: "nowrap", height: "100%", alignItems: "center"}} className="toggle-holder">
            <span>Positive filter</span>
            <Switch checked={trueOrFalse}
                onChange={() => setTrueOrFalse((current) => !current)}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </div>
        <Select
            sx={{ m: 1, minWidth: 120 }}
            variant="standard"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Type"
        >
            <MenuItem value={"equals"}>Equals</MenuItem>
            <MenuItem value={"contains"}>Contains</MenuItem>
            <MenuItem value={"matches"}>Matches</MenuItem>
        </Select>
        <TextField type="text" label="Field" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={fieldName} onChange={(event) => setFieldName(event.target.value)} disabled={disabled} />
        <TextField type="text" label="Text" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={value} onChange={(event) => setValue(event.target.value)} disabled={disabled} />
    </>

}
