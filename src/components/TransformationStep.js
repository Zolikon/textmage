import { useEffect, useState } from "react"
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { ArrowDownward } from "@mui/icons-material";

const TEXT_ALIGNMENT = {
    sx: {
        "& input": {
            textAlign: "center"
        }
    }
}

const TYPES = {
    "replace": {
        name: "Replace",
        transformer: function (from, to) {
            return function transform(input) {
                return input.replaceAll(from, to)
            }
        }
    },
    "regex": {
        name: "Regular expression",
        transformer: function (from, to) {
            return function transform(input) {
                let reg = new RegExp(from, "ig")
                return input.replace(reg, to)
            }
        }
    },
    "append": {
        name: "Append",
        transformer: function (appendText) {
            return function transform(input) {
                return input + appendText
            }
        }
    },
    "insert": {
        name: "Insert at",
        transformer: function (index, text) {
            return function transform(input) {
                return [input.slice(0, index), text, input.slice(index)].join('')
            }
        }
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
        }
    },
    "upper": {
        name: "Transform to uppercase",
        transformer: function () {
            return function transform(input) {
                return input.toUpperCase()
            }
        }
    },
    "lower": {
        name: "Transform to lowercase",
        transformer: function () {
            return function transform(input) {
                return input.toLowerCase()
            }
        }
    }
}

export default function TransformationStep({ id, type, dispatcher }) {

    const [form, setForm] = useState(<></>)
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

    useEffect(() => {
        let transformer = null;
        let form = null;
        switch(type) {
            case "replace": 
                transformer = TYPES[type].transformer(fromValue, toValue)
                form = <>
                {fromField('From')}
                {toField('To')}
                </>
                break
            case "regex": 
                transformer = TYPES[type].transformer(fromValue, toValue)
                form = <>
                {fromField('Regex')}
                {toField('To')}
                </>
                break
            case "append": 
                transformer = TYPES[type].transformer(fromValue)
                form = <>
                {fromField('Text', false, 40)}
                </>
                break
            case "substring": 
                transformer = TYPES[type].transformer(fromValue, toValue)
                form = <>
                {fromField('Start index', true)}
                {toField('end index', true)}
                </>
                break
            case "insert": 
                transformer = TYPES[type].transformer(fromValue, toValue)
                form = <>
                {fromField('Index', true)}
                {toField('Text')}
                </>
                break
            case "upper": 
                transformer = TYPES[type].transformer()
                form = <>
                </>
                break
            case "lower": 
                transformer = TYPES[type].transformer()
                form = <>
                </>
                break
            default:
                throw new Error(`not supported type: ${type}`)
        }
        setForm(()=>form)
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


    return <div className={disabled ? "step disabled-step prevent-select" : "step prevent-select"} style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <IconButton onClick={() => dispatcher({type:"moveStepUp", payload: id})} aria-label="moveup">
                <ArrowUpwardIcon/>
            </IconButton>
            <IconButton onClick={() => dispatcher({type:"moveStepDown", payload: id})} aria-label="movedown">
                <ArrowDownward/>
            </IconButton>
            <div className={disabled ? "prevent-select label disabled-step": "prevent-select label"} style={{width: "40%"}}>{TYPES[type].name}</div>
            {form}
            <IconButton onClick={() => setDisabled((disabledStatus) => !disabledStatus)} aria-label="disable">
                {disabled?<CheckIcon/>: <BlockIcon />}
            </IconButton>
            <IconButton onClick={() => dispatcher({ type: 'closeStep', payload: id })} aria-label="delete" disabled={disabled}>
                <DeleteIcon />
            </IconButton>
        </div>

}

