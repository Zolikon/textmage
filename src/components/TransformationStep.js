import { useEffect, useState } from "react"
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Button } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ArrowDownward } from "@mui/icons-material";

const TEXT_ALIGNMENT = {
    sx: {
        "& input": {
            textAlign: "center"
        }
    }
}

export default function TransformationStep({ id, type, dispatcher }) {

    const [fromValue, setFromValue] = useState('')
    const [toValue, setToValue] = useState('')
    const [disabled, setDisabled] = useState(false)

    function fromField(label, numberOnly=false, width=20){
        return <TextField type={numberOnly?"number":"text" } label={label} InputProps={TEXT_ALIGNMENT} style={{width: `${width}%`}}
        size="small" value={fromValue} onChange={(event) => setFromValue(event.target.value)} disabled={disabled}/>
    }

    function toField(label,numberOnly=false,  width=20) {
        return <TextField type={numberOnly?"number":"text" } label={label} InputProps={TEXT_ALIGNMENT} style={{width: `${width}%`}}
            size="small" value={toValue} onChange={(event) => setToValue(event.target.value)} disabled={disabled}/>
    }

    const TYPES = {
        "replace": {
            name: "Replace",
            transformer: function (from, to) {
                return function transform(input) {
                    return input.replaceAll(from, to)
                }
            },
            form: <>
            {fromField('From')}
            {toField('To')}
            </>
        },
        "regex": {
            name: "Regular expression",
            transformer: function (from, to) {
                return function transform(input) {
                    let reg = new RegExp(from, "ig")
                    return input.replace(reg, to)
                }
            },
            form: <>
            {fromField('Regex')}
            {toField('To')}
            </>
        },
        "append": {
            name: "Append",
            transformer: function (appendText) {
                return function transform(input) {
                    return input + appendText
                }
            },
            form: <>
            {fromField('Append', false, 40)}
            </>
        },
        "insert": {
            name: "Insert at",
            transformer: function (index, text) {
                return function transform(input) {
                    return [input.slice(0, index), text, input.slice(index)].join('')
                }
            },
            form: <>
            {fromField('Index', true)}
            {toField('To insert')}
            </>
        },
        "substring": {
            name: "Substring",
            transformer: function (fromIndex, toIndex) {
                return function transform(input) {
                    if(toIndex) { 
                        return input.substr(Number(fromIndex), Number(toIndex))
                    } else {
                        return input.substr(Number(fromIndex))
                    }
                }
            },
            form: <>
            {fromField('Start(inclusive)', true)}
            {toField('Length', true)}
            </>
        },
        "upper": {
            name: "Transform to uppercase",
            transformer: function () {
                return function transform(input) {
                    return input.toUpperCase()
                }
            },
             /*for some reason returning a fragment or a div here causes infinite render*/
            form: <div></div>
        },
        "lower": {
            name: "Transform to lowercase",
            transformer: function () {
                return function transform(input) {
                    return input.toLowerCase()
                }
            },
            form: <></>
        }
    }

    useEffect(() => {
        let transformer = null;
        switch(type) {
            case "replace": transformer = TYPES[type].transformer(fromValue, toValue)
            case "regex": transformer = TYPES[type].transformer(fromValue, toValue)
            case "append": transformer = TYPES[type].transformer(fromValue)
            case "substring": transformer = TYPES[type].transformer(fromValue, toValue)
            case "insert": transformer = TYPES[type].transformer(fromValue, toValue)
            case "upper": transformer = TYPES[type].transformer()
            case "lower": transformer = TYPES[type].transformer()
        }
        dispatcher({
                type: "updateTransformation", payload: {
                    id: id,
                    type: type,
                    transformer: transformer,
                    disabled: disabled
                }
            })
        }
        , [fromValue, toValue, dispatcher, id, disabled, type])


    return <div style={{ position: "relative" ,width: "100%"}}>
        <div className={disabled ? "step disabled-step prevent-select" : "step prevent-select"} style={{ position: "absolute", display: "flex", flexDirection: "row", gap: "5px", opacity: disabled ? 0.3 : 1 }}>
            <IconButton onClick={() => dispatcher({type:"moveStepUp", payload: id})} aria-label="moveup" disabled={disabled}>
                <ArrowUpwardIcon/>
            </IconButton>
            <IconButton onClick={() => dispatcher({type:"moveStepDown", payload: id})} aria-label="movedown" disabled={disabled}>
                <ArrowDownward/>
            </IconButton>
            <div className="prevent-select label" style={{width: "40%"}}>{TYPES[type].name}</div>
            {TYPES[type].form}
            <IconButton onClick={() => setDisabled(true)} aria-label="disable" disabled={disabled}>
                <DisabledByDefaultIcon />
            </IconButton>
            <IconButton onClick={() => dispatcher({ type: 'closeStep', payload: id })} aria-label="delete" disabled={disabled}>
                <DeleteIcon />
            </IconButton>
        </div>
        {
            disabled &&
            <div style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute", display: "flex", flexDirection: "row" }}>
                <svg style={{ font: "bold 80% sans-serif" }}>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">Disabled</text>
                </svg>
                <Button style={{ height: "50%", alignSelf: "center" }} onClick={() => setDisabled(false)}>✔</Button>
            </div>
        }
    </div>
}
