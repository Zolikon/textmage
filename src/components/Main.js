import { useSteps } from "./StepContext"
import { Step } from "./Step"
import { StepActions } from "./StepActions"
import { Input } from "./Input"
import { Output } from "./Output"
import { Switch } from "@mui/material"

export default function Main() {

    const { toggleLineByLineProcessing, processLineByLine, steps } = useSteps()

    return <main>
        <Input />
        <div className="step-container container">
            <div className="prevent-select title">Steps</div>

            <div style={{ display: "inline" }} className="toggle-holder">
                <span>Execute for each line separately</span>
                <Switch checked={processLineByLine}
                    onChange={toggleLineByLineProcessing}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
            <StepActions />

            <div className="step-holder">
                {steps.map((step) => <Step key={step.id} id={step.id} type={step.type} >{step.form}</Step>)}
            </div>
        </div>
        <Output />
    </main>
}