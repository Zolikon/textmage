import { useEffect, useMemo, useState } from "react"

import TextField from '@mui/material/TextField';
import { MenuItem, Select } from "@mui/material";

const TEXT_ALIGNMENT = {
    sx: {
        "& input": {
            textAlign: "center"
        }
    }
}

export function CsvToJsonLinesStep({ setTransformer, disabled, setTitle }) {
    const [header, setHeader] = useState('')
    const [separator, setSeparator] = useState('')

    const transformer = useMemo(() => function toJson(input) {
        const headers = header.split(separator)
        const values = input.split(separator)
        if (headers.length !== values.length) {
            return null;
        }
        let result = {}
        for (let i = 0; i < headers.length; i++) {
            result[headers[i]] = values[i]
        }
        return JSON.stringify(result)
    }, [header, separator])

    useEffect(() => {
        setTitle("Csv to json lines")
        setTransformer(() => transformer)
    }, [header, separator, setTitle, setTransformer, transformer])

    return <>
        <TextField type="text" label="Header" InputProps={TEXT_ALIGNMENT} style={{ width: "40%" }}
            size="small" value={header} onChange={(event) => setHeader(event.target.value)} disabled={disabled} />
        <TextField type="text" label="Separator" InputProps={TEXT_ALIGNMENT} style={{ width: "10%" }}
            size="small" value={separator} onChange={(event) => setSeparator(event.target.value)} disabled={disabled} />
    </>
}

function getJsonFieldConverter(type) {
    switch (type) {
        case "number":
            return (input) => Number(input)
        case "array":
        case "nested_object":
            return (input) => JSON.parse(input)
        default:
            throw new Error('not supported json field converter')
    }
}

export function JsonFieldConverterStep({ setTransformer, disabled, setTitle }) {
    const [field, setField] = useState('')
    const [convertsionType, setConvertsionType] = useState('number')

    const transformer = useMemo(() => function toJson(input) {
        let result = null;
        try {
            const json = JSON.parse(input)
            if (!json[field]) {
                return null;
            }
            json[field] = getJsonFieldConverter(convertsionType)(json[field])
            result = JSON.stringify(json)
        } catch {
            return null;
        }
        return result;
    }, [field, convertsionType])


    useEffect(() => {
        setTitle("Json field converter")
        setTransformer(() => transformer)
    }, [field, convertsionType, setTitle, setTransformer, transformer])

    return <>
        <Select
            sx={{ m: 1, minWidth: 120 }}
            variant="standard"
            value={convertsionType}
            onChange={(e) => setConvertsionType(e.target.value)}
            label="Type"
        >
            <MenuItem value={"number"}>Number</MenuItem>
            <MenuItem value={"array"}>Array</MenuItem>
            <MenuItem value={"nested_object"}>Nested Object</MenuItem>
        </Select>
        <TextField type="text" label="Field" InputProps={TEXT_ALIGNMENT} style={{ width: "30%" }}
            size="small" value={field} onChange={(event) => setField(event.target.value)} disabled={disabled} />
    </>
}

export function JsonFieldExtractorStep({ setTransformer, disabled, setTitle }) {
    const [field, setField] = useState('')

    useEffect(() => {
        setTitle("Json field extractor")
        setTransformer(() => (input)=>{
            try {
                const json = JSON.parse(input);
                return JSON.stringify(json[field])
            } catch {
                return null;
            }
        })
    }, [field, setTitle, setTransformer])

    return <>
        <TextField type="text" label="Field" InputProps={TEXT_ALIGNMENT} style={{ width: "30%" }}
            size="small" value={field} onChange={(event) => setField(event.target.value)} disabled={disabled} />
    </>
}