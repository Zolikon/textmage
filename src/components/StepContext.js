import { createContext, useContext, useReducer } from "react";

const initialState = {
    inputText: "",
    outputText: "",
    steps: [],
    processLineByLine: true
}

function generateId() {
    return Math.floor(Math.random() * 1_000_000);
}

const MAX_NUMBER_OF_STEPS = 5;

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
            const indexOfElementToMoveUp = state.steps.findIndex(element => element.id === payload)
            if (indexOfElementToMoveUp > 0) {
                const tempArray = [...state.steps]
                const elementToMove = tempArray.splice(indexOfElementToMoveUp, 1)[0]
                tempArray.splice(indexOfElementToMoveUp - 1, 0, elementToMove)
                return { ...state, steps: tempArray }
            }
            return state
        case "moveStepDown":
            const indexOfElementToMoveDown = state.steps.findIndex(element => element.id === payload)
            if (indexOfElementToMoveDown < state.steps.length - 1) {
                const tempArray = [...state.steps]
                const elementToMove = tempArray.splice(indexOfElementToMoveDown, 1)[0]
                tempArray.splice(indexOfElementToMoveDown + 1, 0, elementToMove)
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
        case "clearInput":
            return { ...state, inputText: '' }
        default:
            throw new Error("unsupported operation")
    }

}


const StepContext = createContext()


function StepProvider({ children }) {
    const [{ inputText, outputText, steps, processLineByLine }, dispatcher] = useReducer(reducer, initialState);

    const toggleLineByLineProcessing = function () {
        dispatcher({ type: "toggleLineByLineProcessing" })
    }

    const executeTranformation = function () {
        dispatcher({ type: "executeTransformation" })
    }

    const addNewStep = function (form, type) {
        dispatcher({ type: "newStep", payload: { form, type } })
    }

    const updateInputText = function (text) {
        dispatcher({ type: "newInputText", payload: text })
    }

    const updateStep = function (updateObject) {
        dispatcher({ type: "updateStep", payload: updateObject })
    }

    const moveStepUp = function (id) {
        dispatcher({ type: "moveStepUp", payload: id })
    }

    const moveStepDown = function (id) {
        dispatcher({ type: "moveStepUp", payload: id })
    }

    const closeStep = function (id) {
        dispatcher({ type: 'closeStep', payload: id })
    }

    return <StepContext.Provider
        value={{
            inputText,
            steps,
            processLineByLine,
            outputText,
            updateInputText,
            toggleLineByLineProcessing,
            executeTranformation,
            addNewStep,
            updateStep,
            moveStepUp,
            moveStepDown,
            closeStep,
            isMaxStepsReached: steps.length >= MAX_NUMBER_OF_STEPS
        }}
    >
        {children}
    </StepContext.Provider>
}

function useSteps() {
    return useContext(StepContext)
}

export { useSteps, StepProvider }