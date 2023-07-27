import { useReducer } from "react";
import Switch from '@mui/material/Switch';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Step from './Step'
import { Input } from './Input';
import { Output } from './Output';
import { StepActions } from './StepActions';

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

const MAX_NUMBER_OF_STEPS = 5;

function App() {
    const [{ inputText, outputText, steps, processLineByLine }, dispatcher] = useReducer(reducer, initialState);

    document.title = "TextMage"

    return <>
        <div id="inner-body">
            <Header>
            </Header>
            <Input dispatcher={dispatcher} inputText={inputText} />
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
                <StepActions dispatcher={dispatcher} isMaxStepsReached={steps.length >= MAX_NUMBER_OF_STEPS} />
            </div>
            <Output dispatcher={dispatcher} outputText={outputText} />
            <Footer />
        </div>
    </>

}

export default App;
