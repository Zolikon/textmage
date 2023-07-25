import { useEffect, useState } from "react"

import TextField from '@mui/material/TextField';

const TEXT_ALIGNMENT = {
    sx: {
        "& input": {
            textAlign: "center"
        }
    }
}

export const REGEX_REPLACE_TYPE = "Regex replace"
export const STRING_REPLACE_TYPE = "String replace"

export function ReplaceStep({ type, setTransformer, disabled, setTitle }) {

    const [fromValue, setFromValue] = useState('')
    const [toValue, setToValue] = useState('')

    useEffect(() => {
        setTitle(type)
        if (type === STRING_REPLACE_TYPE) {
            setTransformer(() => (input) => input.replaceAll(fromValue, toValue))
        } else if (type === REGEX_REPLACE_TYPE) {
            setTransformer(() => (input) => {
                let reg = new RegExp(fromValue, "ig")
                return input.replace(reg, toValue)
            })
        }
    }, [fromValue, toValue, setTitle, setTransformer, type])

    return <>
        <TextField type="text" label={type === STRING_REPLACE_TYPE ? "From" : "Regex"} InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={fromValue} onChange={(event) => setFromValue(event.target.value)} disabled={disabled} />
        <TextField type="text" label="To" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={toValue} onChange={(event) => setToValue(event.target.value)} disabled={disabled} />
    </>

}

export function SubstringStep({ setTransformer, disabled, setTitle }) {

    const [fromValue, setFromValue] = useState('')
    const [toValue, setToValue] = useState('')

    useEffect(() => {
        setTitle("Substring")
        if (toValue) {
            setTransformer(() => (input) => input.substr(Number(fromValue), Number(toValue)))
        } else {
            setTransformer(() => (input) => input.substr(Number(fromValue)))
        }
    }, [fromValue, toValue, setTitle, setTransformer])

    return <>
        <TextField type="number" label="Start index" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={fromValue} onChange={(event) => setFromValue(event.target.value)} disabled={disabled} />
        <TextField type="number" label="End index" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={toValue} onChange={(event) => setToValue(event.target.value)} disabled={disabled} />
    </>

}

export function InsertStep({ setTransformer, disabled, setTitle }) {

    const [fromValue, setFromValue] = useState('')
    const [toValue, setToValue] = useState('')

    useEffect(() => {
        setTitle("Insert at")
        const index = Number(fromValue)
        setTransformer(() => (input) => [input.slice(0, index), toValue, input.slice(index)].join(''))
    }, [fromValue, toValue, setTitle, setTransformer])

    return <>
        <TextField type="number" label="Index" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={fromValue} onChange={(event) => setFromValue(event.target.value)} disabled={disabled} />
        <TextField type="text" label="text" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={toValue} onChange={(event) => setToValue(event.target.value)} disabled={disabled} />
    </>

}

export function AppendStep({ setTransformer, disabled, setTitle }) {

    const [fromValue, setFromValue] = useState('')

    useEffect(() => {
        setTitle("Append")
        setTransformer(() => (input) => input + fromValue)
    }, [fromValue, setTitle, setTransformer])

    return <>
        <TextField type="text" label="Text" InputProps={TEXT_ALIGNMENT} style={{ width: "40%" }}
            size="small" value={fromValue} onChange={(event) => setFromValue(event.target.value)} disabled={disabled} />
    </>

}
