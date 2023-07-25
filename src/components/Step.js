import React, { useEffect, useState } from "react"
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { ArrowDownward } from "@mui/icons-material";

function translateTypeToClass(type) {
    switch(type) {
        case "transformation":
            return "transformation-step"
        case "filter":
            return "filter-step"
        default:
            return ""
    }
}

export default function Step({ type, dispatcher, id, children }) {

    const [disabled, setDisabled] = useState(false)
    const [title, setTitle] = useState('')
    const [transformer, setTransformer] = useState((input) => { })

    const modifiedChildren = React.Children.map(children, (child) => {
        return React.cloneElement(child, { setTransformer: setTransformer, disabled: disabled, setTitle: setTitle });
    });

    useEffect(() => {
        dispatcher({
            type: "updateStep",
            payload: {
                id: id,
                title: title,
                disabled: disabled,
                transformer: transformer
            }
        })
    }, [dispatcher, id, disabled, transformer, title])

    const classNames = [translateTypeToClass(type), disabled ? "step disabled-step prevent-select" : "step prevent-select"].join(" ")

    return <div className={classNames} style={{ display: "flex", flexDirection: "row", gap: "5px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignContent:"center" ,flexDirection: "row", gap: "5px" }}>
            <IconButton onClick={() => dispatcher({ type: "moveStepUp", payload: id })} aria-label="moveup">
                <ArrowUpwardIcon />
            </IconButton>
            <IconButton onClick={() => dispatcher({ type: "moveStepDown", payload: id })} aria-label="movedown">
                <ArrowDownward />
            </IconButton>
            <div className={disabled ? "prevent-select label disabled-step" : "prevent-select label"} style={{ width: "40%" }}>{title}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "5px", flexWrap:"wrap" }}>
            {modifiedChildren}
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <IconButton onClick={() => setDisabled((disabledStatus) => !disabledStatus)} aria-label="disable">
                {disabled ? <CheckIcon /> : <BlockIcon />}
            </IconButton>
            <IconButton onClick={() => dispatcher({ type: 'closeStep', payload: id })} aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </div>
    </div>

}