import Button from '@mui/material/Button';
import { useRef } from 'react';

export function Output({ dispatcher, outputText }) {

    const textAreaRef = useRef(null);

    return <div className="output-container container">
        <p className="prevent-select title">Output</p>
        <div style={{ display: "block" }}>
            <Button onClick={() => navigator.clipboard.writeText(outputText)}>Copy</Button>
            <Button onClick={() => {
                dispatcher({ type: "moveOutputToInput", payload: outputText });
                textAreaRef.current.value = "";
            }}>Move to input</Button>
        </div>
        <textarea ref={textAreaRef} className="custom-text-area" value={outputText} readOnly />
    </div >
}