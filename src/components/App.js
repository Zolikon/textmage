import './App.css';
import Header from './Header';
import Footer from './Footer';
import Step from './Step'
import { ToUpperCaseStep, ToLowerCaseStep } from "./transformation-steps/NoInputSteps"

import { useReducer } from "react";
import { Dropdown } from "react-bootstrap";
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import { AppendStep, InsertStep, REGEX_REPLACE_TYPE, ReplaceStep, STRING_REPLACE_TYPE, SubstringStep } from './transformation-steps/ReplaceSteps';
import { GeneralFilterStep, JsonFilterStep } from './filter-steps/FilterStep';
import { ValidJsonStep } from './filter-steps/ValidJsonStep';
import { CsvToJsonLinesStep, JsonFieldConverterStep, JsonFieldExtractorStep } from './transformation-steps/JsonSteps';

const initialState = {
    inputText: "",
    outputText: "",
    steps: [],
    processLineByLine: true
}

function generateId() {
    return Math.floor(Math.random() * 1_000_000);
}

function reducer(state, { type, payload }) {
    switch (type) {
        case "newInputText":
            return { ...state, inputText: payload }

        case "newStep":
            return {
                ...state, steps: [...state.steps, {
                    id: generateId(),
                    form: payload.form,
                    title: payload.title,
                    type: payload.type
                }]
            }
        case "updateStep":
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
        case "updateStepDisabledStatus":
            return {
                ...state,
                steps: state.steps.map(item => {
                    if (item.id === payload.id) {
                        item.disabled = payload.disabled
                    }
                    return item
                }
                )
            }

        case "moveStepUp":
            const indexOfElement = state.steps.findIndex(element => element.id === payload)
            if (indexOfElement > 0) {
                const tempArray = [...state.steps]
                const elementToMove = tempArray.splice(indexOfElement, 1)[0]
                tempArray.splice(indexOfElement - 1, 0, elementToMove)
                return { ...state, steps: tempArray }
            }
            return state
        case "moveStepDown":
            const indexOfElement2 = state.steps.findIndex(element => element.id === payload)
            if (indexOfElement2 < state.steps.length - 1) {
                const tempArray = [...state.steps]
                const elementToMove = tempArray.splice(indexOfElement2, 1)[0]
                tempArray.splice(indexOfElement2 + 1, 0, elementToMove)
                return { ...state, steps: tempArray }
            }
            return state
        case "closeStep":
            return { ...state, steps: state.steps.filter(item => item.id !== payload) }
        case "executeTransformation":
            let text = state.processLineByLine ? state.inputText.split('\n') : [state.inputText]

            for (const step of state.steps) {
                text = text.map(line => {
                    if (line && !step.disabled) {
                        line = step.transformer(line)
                    }
                    return line
                }).filter(line => line !== null)
            }

            return { ...state, outputText: text.join('\n') }
        case "toggleLineByLineProcessing":
            return { ...state, processLineByLine: !state.processLineByLine }
        case "moveOutputToInput":
            return { ...state, inputText: payload, outputText: '' }
        case "clearInput":
            return { ...state, inputText: '' }
        default:
            throw new Error("unsupported operation")
    }

}

function App() {
    const [{ inputText, outputText, steps, processLineByLine }, dispatcher] = useReducer(reducer, initialState);

    document.title = "TextMage"

    return <>
        <div id="inner-body">
            <Header>
            </Header>
            <div className="input-container container">
                <p className="prevent-select title">Input</p>
                <div>
                    <Button onClick={() => dispatcher({ type: "clearInput" })}>Reset</Button>
                </div>
                <textarea className="custom-text-area" value={inputText} onChange={(event) => dispatcher({ type: "newInputText", payload: event.target.value })} />
            </div>
            <div className="step-container container">
                <div className="prevent-select title">Steps</div>

                <div style={{ display: "inline" }} className="toggle-holder">
                    <span>Execute for each line separately</span>
                    <Switch checked={processLineByLine}
                        onChange={() => dispatcher({ type: "toggleLineByLineProcessing" })}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>

                <div className="step-holder">
                    {steps.map((step) => <Step key={step.id} id={step.id} dispatcher={dispatcher} title={step.title} type={step.type} >{step.form}</Step>)}
                </div>
                <div className="step-action-holder">
                    <Dropdown style={{ width: "30%", alignSelf: "center" }}>
                        <Dropdown.Toggle variant="success" disabled={steps.length >= 5} style={{backgroundColor: "var(--filter_color)", color: "black"}}>
                            Add filter
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <GeneralFilterStep />, type: "filter" } })}>Text Filter</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <JsonFilterStep />, type: "filter" } })}>Json filter</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <ValidJsonStep />, type: "filter" } })}>Valid json</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown style={{ width: "25%", alignSelf: "center" }}>
                        <Dropdown.Toggle variant="success" disabled={steps.length >= 5} style={{backgroundColor: "var(--transformation_color)", color: "black"}}>
                            Add text transformation
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <ToUpperCaseStep />, type: "transformation" } })}>To Upper case</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <ToLowerCaseStep />, type: "transformation" } })}>To Lower case</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <ReplaceStep type={STRING_REPLACE_TYPE} />, type: "transformation" } })}>Replace</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <ReplaceStep type={REGEX_REPLACE_TYPE} />, type: "transformation" } })}>Regular expression</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <SubstringStep />, type: "transformation" } })}>Substring</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <AppendStep />, type: "transformation" } })}>Append</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <InsertStep />, type: "transformation" } })}>Insert</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown style={{ width: "25%", alignSelf: "center" }}>
                        <Dropdown.Toggle variant="success" disabled={steps.length >= 5} style={{backgroundColor: "var(--json_transformation_color)", color: "black"}}>
                            Add json transformation
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <CsvToJsonLinesStep />, type: "json_transformation" } })}>Csv to Json line</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <JsonFieldConverterStep />, type: "json_transformation" } })}>Json field converter</Dropdown.Item>
                            <Dropdown.Item onClick={() => dispatcher({ type: "newStep", payload: { form: <JsonFieldExtractorStep />, type: "json_transformation" } })}>Json field extractor</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button style={{ alignSelf: "center" }} size='large' variant="contained" disabled={steps.length === 0} onClick={() => dispatcher({ type: "executeTransformation" })}>Execute</Button>
                </div>
            </div>
            <div className="output-container container">
                <p className="prevent-select title">Output</p>
                <div style={{ display: "block" }}>
                    <Button onClick={() => navigator.clipboard.writeText(outputText)}>Copy</Button>
                    <Button onClick={() => dispatcher({ type: "moveOutputToInput", payload: outputText })}>Move to input</Button>
                </div>
                <textarea className="custom-text-area" value={outputText} readOnly />
            </div>
            <Footer />
        </div>
    </>

}

export default App;
