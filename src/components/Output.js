import Button from "@mui/material/Button";
import { useRef } from "react";
import { useSteps } from "./StepContext";

export function Output() {
  const { updateInputText, outputText } = useSteps();
  const textAreaRef = useRef(null);

  return (
    <div className="output-container container">
      <p className="prevent-select title">Output</p>
      <div style={{ display: "block" }}>
        <Button
          style={{ backgroundColor: "green", color: "white", margin: "5px", padding: "2px" }}
          onClick={() => {
            navigator.clipboard.writeText(textAreaRef.current.value);
          }}
        >
          Copy to clipboard
        </Button>
        <Button
          style={{ backgroundColor: "green", color: "white", margin: "5px", padding: "2px" }}
          onClick={() => {
            updateInputText(textAreaRef.current.value);
            textAreaRef.current.value = undefined;
          }}
        >
          Copy to input
        </Button>
      </div>
      <textarea ref={textAreaRef} value={outputText} className="custom-text-area" readOnly />
    </div>
  );
}
