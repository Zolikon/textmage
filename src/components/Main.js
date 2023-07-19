import { useReducer } from "react";
import TransformationStep from "./TransformationStep";
import { Dropdown } from "react-bootstrap";
import Button from '@mui/material/Button';

const initialState = {
    inputText: "",
    outputText: "",
    steps: []
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
        case "closeStep":
            return { ...state, steps: state.steps.filter(item => item.id !== payload) }
        case "executeTransformation":
            let text = state.inputText.split('\n')

            for (const step of state.steps) {
                text = text.map(line => {
                    if (line && !step.disabled) {
                        line = step.transformer(line)
                    }
                    return line
                })
            }

            return { ...state, outputText: text.join('\n') }

        default:
            throw new Error("unsupported operation")
    }

}

export default function Main() {
    const [{ inputText, outputText, steps }, dispatcher] = useReducer(reducer, initialState);


    return <main>
        <div>
            <p className="prevent-select label">Input</p>
            <textarea className="custom-text-area" value={inputText} onChange={(event) => dispatcher({ type: "newInputText", payload: event.target.value })} />
        </div>
        <div className="step-holder">
            <p className="prevent-select label">Steps</p>

            {steps.map((step) => <TransformationStep key={step.id} id={step.id} dispatcher={dispatcher} type={step.type} />)}
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
                </Dropdown.Menu>
            </Dropdown>

            <Button style={{ width: "50%", alignSelf: "center" }} size="large" variant="contained" disabled={steps.length === 0} onClick={() => dispatcher({ type: "executeTransformation" })}>Transform</Button>
        </div>
        <div>
            <p className="prevent-select label">Output</p>
            <textarea className="custom-text-area" value={outputText} readOnly />
            <Button>Copy</Button>
        </div>

    </main>
}