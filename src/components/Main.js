import { useSteps } from "./StepContext";
import { Step } from "./Step";
import { StepActions } from "./StepActions";
import { Input } from "./Input";
import { Output } from "./Output";

export default function Main() {
  const { steps } = useSteps();

  return (
    <main>
      <Input />
      <div className="step-container container">
        <div className="prevent-select title">Steps</div>
        <StepActions />

        <div className="step-holder">
          {steps.map((step) => (
            <Step
              key={step.id}
              id={step.id}
              type={step.type}
              allowLineByLineProcessing={step.allowLineByLineProcessing}
            >
              {step.form}
            </Step>
          ))}
        </div>
      </div>
      <Output />
    </main>
  );
}
