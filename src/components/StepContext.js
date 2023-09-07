import { createContext, useContext, useReducer } from "react";

const initialState = {
  inputText: "",
  outputText: "",
  steps: [],
};

function generateId() {
  return Math.floor(Math.random() * 1_000_000);
}

const MAX_NUMBER_OF_STEPS = 5;

function reducer(state, { type, payload }) {
  switch (type) {
    case "newInputText":
      return { ...state, inputText: payload };

    case "newStep":
      return {
        ...state,
        steps: [
          ...state.steps,
          {
            id: generateId(),
            title: payload.title,
            form: payload.form,
            type: payload.type,
            allowLineByLineProcessing: payload.allowLineByLineProcessing,
            lineByLine: payload.allowLineByLineProcessing,
          },
        ],
      };
    case "updateStep":
      return {
        ...state,
        steps: state.steps.map((item) => {
          if (item.id === payload.id) {
            item.transformer = payload.transformer;
            item.disabled = payload.disabled;
            item.lineByLine = payload.lineByLine;
          }
          return item;
        }),
      };
    case "updateStepDisabledStatus":
      return {
        ...state,
        steps: state.steps.map((item) => {
          if (item.id === payload.id) {
            item.disabled = payload.disabled;
          }
          return item;
        }),
      };

    case "moveStepUp":
      const indexOfElementToMoveUp = state.steps.findIndex((element) => element.id === payload);
      if (indexOfElementToMoveUp > 0) {
        const tempArray = [...state.steps];
        const elementToMove = tempArray.splice(indexOfElementToMoveUp, 1)[0];
        tempArray.splice(indexOfElementToMoveUp - 1, 0, elementToMove);
        return { ...state, steps: tempArray };
      }
      return state;
    case "moveStepDown":
      const indexOfElementToMoveDown = state.steps.findIndex((element) => element.id === payload);
      if (indexOfElementToMoveDown < state.steps.length - 1) {
        const tempArray = [...state.steps];
        const elementToMove = tempArray.splice(indexOfElementToMoveDown, 1)[0];
        tempArray.splice(indexOfElementToMoveDown + 1, 0, elementToMove);
        return { ...state, steps: tempArray };
      }
      return state;
    case "closeStep":
      return { ...state, steps: state.steps.filter((item) => item.id !== payload) };
    case "executeTransformation":
      const convertText = (text, lineByLine) => (lineByLine ? text.split("\n") : [text]);
      let text = state.inputText;

      for (const step of state.steps) {
        text = convertText(text, step.lineByLine)
          .map((line) => {
            if (line && !step.disabled) {
              line = step.transformer(line);
            }
            return line;
          })
          .filter((line) => line !== null)
          .join("\n");
      }
      return { ...state, outputText: text };
    case "clearInput":
      return { ...state, inputText: "" };
    default:
      throw new Error("unsupported operation");
  }
}

const StepContext = createContext();

function StepProvider({ children }) {
  const [{ inputText, outputText, steps }, dispatcher] = useReducer(reducer, initialState);

  const executeTranformation = function () {
    dispatcher({ type: "executeTransformation" });
  };

  const addNewStep = function (form, type, allowLineByLineProcessing = true) {
    dispatcher({ type: "newStep", payload: { form, type, allowLineByLineProcessing } });
  };

  const updateInputText = function (text) {
    dispatcher({ type: "newInputText", payload: text });
  };

  const updateStep = function (updateObject) {
    dispatcher({ type: "updateStep", payload: updateObject });
  };

  const moveStepUp = function (id) {
    dispatcher({ type: "moveStepUp", payload: id });
  };

  const moveStepDown = function (id) {
    dispatcher({ type: "moveStepDown", payload: id });
  };

  const closeStep = function (id) {
    dispatcher({ type: "closeStep", payload: id });
  };

  return (
    <StepContext.Provider
      value={{
        inputText,
        steps,
        outputText,
        updateInputText,
        executeTranformation,
        addNewStep,
        updateStep,
        moveStepUp,
        moveStepDown,
        closeStep,
        isMaxStepsReached: steps.length >= MAX_NUMBER_OF_STEPS,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}

function useSteps() {
  return useContext(StepContext);
}

export { useSteps, StepProvider };
