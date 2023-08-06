import Button from '@mui/material/Button';
import { useRef } from 'react';
import { useSteps } from './StepContext';

export function Output() {

    const { updateInputText, outputText} = useSteps()
    const textAreaRef = useRef(null);

    return <div className="output-container container">
        <p className="prevent-select title">Output</p>
        <div style={{ display: "block" }}>
            <Button onClick={() => {
                navigator.clipboard.writeText(textAreaRef.current.value)
            }}>Copy</Button>
            <Button onClick={() => {
                updateInputText(textAreaRef.current.value);
                textAreaRef.current.value = "";
            }}>Move to input</Button>
        </div>
        <textarea ref={textAreaRef} value={outputText} className="custom-text-area" readOnly />
    </div >
}