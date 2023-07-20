import { useReducer } from "react";
import TransformationStep from "./TransformationStep";
import { Dropdown } from "react-bootstrap";
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

const initialState = {
    inputText: "",
    outputText: "",
    steps: [],
    processLineByLine: true
}

function reducer(state, { type, payload }) {
    switch (type) {
        case "newInputText":
            return { ...state, inputText: payload }
        case "newTransformation":
            return { ...state, steps: [...state.steps, { id: Math.floor(Math.random() * 1_000_000), type: payload }] }
        case "updateTransformation":
            return {
                ...state,
                steps: state.steps.map(item => {
                    if (item.id === payload.id) {
                        item.transformer = payload.transformer
                        item.disabled = payload.disabled
                    }
                    return item
                }
                )
            }
        case "moveStepUp":
            const indexOfElement = state.steps.findIndex(element => element.id === payload)
            if(indexOfElement > 0) {
                const tempArray = [...state.steps]
                const elementToMove = tempArray.splice(indexOfElement, 1)[0]
                tempArray.splice(indexOfElement-1, 0, elementToMove)
                return { ...state, steps: tempArray}
            }
            return state
        case "moveStepDown":
            const indexOfElement2 = state.steps.findIndex(element => element.id === payload)
            if(indexOfElement2 < state.steps.length-1) {
                const tempArray = [...state.steps]
                const elementToMove = tempArray.splice(indexOfElement2, 1)[0]
                tempArray.splice(indexOfElement2+1, 0, elementToMove)
                return { ...state, steps: tempArray}
            }
            return state
        case "closeStep":
            return { ...state, steps: state.steps.filter(item => item.id !== payload) }
        case "executeTransformation":
            let text = state.processLineByLine?state.inputText.split('\n'):[state.inputText]

            for (const step of state.steps) {
                text = text.map(line => {
                    if (line && !step.disabled) {
                        line = step.transformer(line)
                    }
                    return line
                })
            }

            return { ...state, outputText: text.join('\n') }
        case "toggleLineByLineProcessing":
            return { ...state, processLineByLine: !state.processLineByLine }        
        default:
            throw new Error("unsupported operation")
    }

}

export default function Main() {
    const [{ inputText, outputText, steps, processLineByLine }, dispatcher] = useReducer(reducer, initialState);


    return <main>
        <div className="text-area-holder">
            <p className="prevent-select title">Input</p>
            <div></div>
            <textarea className="custom-text-area" value={inputText} onChange={(event) => dispatcher({ type: "newInputText", payload: event.target.value })} />
        </div>
        <div className="step-section">
            <div className="prevent-select title">Steps</div>
            <div >
                <div style={{display: "inline"}}>
                    <span>Execute for each line separately</span>
                    <Switch checked={processLineByLine}
                        onChange={()=>dispatcher({type:"toggleLineByLineProcessing"})}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
            </div>
            <div className="step-holder">
                {steps.map((step) => <TransformationStep key={step.id} id={step.id} dispatcher={dispatcher} type={step.type} />)}
            </div>
            <div className="step-action-holder">
                <Dropdown style={{ width: "50%", alignSelf: "center" }}>
                    <Dropdown.Toggle variant="success" disabled={steps.length >= 5}>
                        Add transformation
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => dispatcher({ type: "newTransformation", payload: "replace" })}>Replace</Dropdown.Item>
                        <Dropdown.Item onClick={() => dispatcher({ type: "newTransformation", payload: "regex" })}>Regular expression</Dropdown.Item>
                        <Dropdown.Item onClick={() => dispatcher({ type: "newTransformation", payload: "append" })}>Append</Dropdown.Item>
                        <Dropdown.Item onClick={() => dispatcher({ type: "newTransformation", payload: "substring" })}>Substring</Dropdown.Item>
                        <Dropdown.Item onClick={() => dispatcher({ type: "newTransformation", payload: "insert" })}>Insert</Dropdown.Item>
                        <Dropdown.Item onClick={() => dispatcher({ type: "newTransformation", payload: "upper" })}>To uppercase</Dropdown.Item>
                        <Dropdown.Item onClick={() => dispatcher({ type: "newTransformation", payload: "lower" })}>To lowercase</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button style={{ width: "50%", alignSelf: "center" }} size="large" variant="contained" disabled={steps.length === 0} onClick={() => dispatcher({ type: "executeTransformation" })}>Transform</Button>
            </div>
        </div>
        <div className="text-area-holder">
            <p className="prevent-select title">Output</p>
            <div>
                <Button>Copy</Button>
                <Button>Move to input</Button>
            </div>
            <textarea className="custom-text-area" value={outputText} readOnly />
        </div>

    </main>
}