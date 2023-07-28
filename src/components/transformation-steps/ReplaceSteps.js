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

export function ReplaceStep({ type, setTransformer, disabled, setTitle, setHelp }) {

    const [fromValue, setFromValue] = useState('')
    const [toValue, setToValue] = useState('')

    useEffect(() => {
        setTitle(type)
        if (type === STRING_REPLACE_TYPE) {
            setHelp(
                <>
                    <h2>Replace text</h2>
                    <div>Replaces all occurence of the string to the provided other string</div>
                </>)
            setTransformer(() => (input) => input.replaceAll(fromValue, toValue))
        } else if (type === REGEX_REPLACE_TYPE) {
            setHelp(
                <>
                    <h2>Replace regex</h2>
                    <div>Replaces all matches of the given regular expression to the provided other string</div>
                </>)
            setTransformer(() => (input) => {
                let reg = new RegExp(fromValue, "ig")
                return input.replace(reg, toValue)
            })
        }
    }, [fromValue, toValue, setTitle, setTransformer, type, setHelp])

    return <>
        <TextField type="text" label={type === STRING_REPLACE_TYPE ? "From" : "Regex"} InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={fromValue} onChange={(event) => setFromValue(event.target.value)} disabled={disabled} />
        <TextField type="text" label="To" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={toValue} onChange={(event) => setToValue(event.target.value)} disabled={disabled} />
    </>

}

export function SubstringStep({ setTransformer, disabled, setTitle, setHelp }) {

    const [fromValue, setFromValue] = useState('')
    const [toValue, setToValue] = useState('')

    useEffect(() => {
        setTitle("Substring")
        setHelp(<>
            <h2>Expracts substring</h2>
            <div>Extrancts substring based on 0-based indexes</div>
            <div>End index defies the first index NOT to be included</div>
            <div>If End index is not given, all the remaining string after the start index will be the output</div>
        </>)
        if (toValue) {
            setTransformer(() => (input) => input.substr(Number(fromValue), Number(toValue)))
        } else {
            setTransformer(() => (input) => input.substr(Number(fromValue)))
        }
    }, [fromValue, toValue, setTitle, setTransformer, setHelp])

    return <>
        <TextField type="number" label="Start index" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={fromValue} onChange={(event) => setFromValue(event.target.value)} disabled={disabled} />
        <TextField type="number" label="End index" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={toValue} onChange={(event) => setToValue(event.target.value)} disabled={disabled} />
    </>

}

export function InsertStep({ setTransformer, disabled, setTitle, setHelp }) {

    const [fromValue, setFromValue] = useState('')
    const [toValue, setToValue] = useState('')

    useEffect(() => {
        setTitle("Insert at")
        setHelp(<>
            <h2>Insert a string</h2>
            <div>Inserts a string into the input at a give 0-based index</div>
            <br />
            <div><strong>Example:</strong></div>
            <div>Input <code>"abc"</code>, index: 1, text: '!'</div>
            <div>Output will be <code>a!bc</code></div>
            <div>Input <code>"abc"</code>, index: -1, text: '!'</div>
            <div>Output will be <code>ab!c</code></div>
            <div>Note: negative index counts from the end of the string</div>
        </>)
        const index = Number(fromValue)
        setTransformer(() => (input) => [input.slice(0, index), toValue, input.slice(index)].join(''))
    }, [fromValue, toValue, setTitle, setTransformer, setHelp])

    return <>
        <TextField type="number" label="Index" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={fromValue} onChange={(event) => setFromValue(event.target.value)} disabled={disabled} />
        <TextField type="text" label="text" InputProps={TEXT_ALIGNMENT} style={{ width: "20%" }}
            size="small" value={toValue} onChange={(event) => setToValue(event.target.value)} disabled={disabled} />
    </>

}

export function AppendStep({ setTransformer, disabled, setTitle, setHelp }) {

    const [fromValue, setFromValue] = useState('')

    useEffect(() => {
        setTitle("Append")
        setHelp(<>
            <h2>Append to string</h2>
            <div>Appends the given string to the end of the input</div>
        </>)
        setTransformer(() => (input) => input + fromValue)
    }, [fromValue, setTitle, setTransformer, setHelp])

    return <>
        <TextField type="text" label="Text" InputProps={TEXT_ALIGNMENT} style={{ width: "40%" }}
            size="small" value={fromValue} onChange={(event) => setFromValue(event.target.value)} disabled={disabled} />
    </>

}
