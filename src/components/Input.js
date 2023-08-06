import Button from '@mui/material/Button';
import { useRef } from 'react';
import { useSteps } from './StepContext';

export function Input() {

    const {inputText, updateInputText} = useSteps()

    return <div className="input-container container">
        <p className="prevent-select title">Input</p>
        <div>
            <Button onClick={() => {
                updateInputText('')
            }}>Reset</Button>
        </div>
        <textarea value={inputText} onChange={(e)=>updateInputText(e.target.value)} className="custom-text-area"/>
    </div>

}