import Button from '@mui/material/Button';
import { useRef } from 'react';

export function Input({ dispatcher, inputText }) {

    const textAreaRef = useRef(null);

    return <div className="input-container container">
        <p className="prevent-select title">Input</p>
        <div>
            <Button onClick={() => {
                dispatcher({ type: "clearInput" });
                textAreaRef.current.value = '';
            }}>Reset</Button>
        </div>
        <textarea ref={textAreaRef} className="custom-text-area" value={inputText} onChange={(event) => dispatcher({ type: "newInputText", payload: event.target.value })} />
    </div>

}