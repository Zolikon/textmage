import { AppendStep, InsertStep, REGEX_REPLACE_TYPE, ReplaceStep, STRING_REPLACE_TYPE, SubstringStep } from './transformation-steps/ReplaceSteps';
import { GeneralFilterStep, JsonFilterStep } from './filter-steps/FilterStep';
import { ValidJsonStep } from './filter-steps/ValidJsonStep';
import { ToUpperCaseStep, ToLowerCaseStep } from "./transformation-steps/NoInputSteps"
import { CsvToJsonLinesStep, JsonFieldConverterStep, JsonFieldExtractorStep, JsonFieldRemoverStep } from './transformation-steps/JsonSteps';
import { Dropdown } from "react-bootstrap";
import Button from '@mui/material/Button';
import { useMemo, useState } from 'react';
import { useSteps } from './StepContext';


const BASE_BUTTON_STYLE = {
    alignSelf: "center",
    color: "black",
    width: "200px"
}


export function StepActions() {

    const {isMaxStepsReached, addNewStep, executeTranformation} = useSteps()

    const [selectedTypeName, setSelectedTypeName] = useState('')

    const types = useMemo(() => {
        return {
            "filter": {
                "name": "Filter",
                "color": "filter_color",
                "form": <>
                    <Dropdown.Item onClick={() => addNewStep(<GeneralFilterStep />, "filter" )}>Text Filter</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<JsonFilterStep />, "filter" )}>Json filter</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<ValidJsonStep />, "filter" )}>Valid json</Dropdown.Item>
                </>
            },
            "text_transformation": {
                "name": "Text transformation",
                "color": "transformation_color",
                "form": <>
                    <Dropdown.Item onClick={() => addNewStep(<ToUpperCaseStep />,"transformation")}>To Upper case</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<ToLowerCaseStep />,"transformation")}>To Lower case</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<ReplaceStep type={STRING_REPLACE_TYPE} />,"transformation")}>Replace</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<ReplaceStep type={REGEX_REPLACE_TYPE} />,"transformation")}>Regular expression</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<SubstringStep />,"transformation" )}>Substring</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<AppendStep />,"transformation")}>Append</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<InsertStep />,"transformation")}>Insert</Dropdown.Item>
                </>
            },
            "json_transformation": {
                "name": "Json transformation",
                "color": "json_transformation_color",
                "form": <>
                    <Dropdown.Item onClick={() => addNewStep(<CsvToJsonLinesStep />,"json_transformation")}>Csv to Json line</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<JsonFieldConverterStep />,"json_transformation")}>Json field converter</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<JsonFieldExtractorStep />,"json_transformation")}>Json field extractor</Dropdown.Item>
                    <Dropdown.Item onClick={() => addNewStep(<JsonFieldRemoverStep />,"json_transformation")}>Json field remover</Dropdown.Item>
                </>
            }
        }
    }, [addNewStep])

    const selectedType = types[selectedTypeName]


    return <div className="step-action-holder">
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Button style={{ ...BASE_BUTTON_STYLE, backgroundColor: "var(--filter_color)" }} size='small' variant="contained" onClick={() => { setSelectedTypeName("filter") }}>Filter</Button>
            <Button style={{ ...BASE_BUTTON_STYLE, backgroundColor: "var(--transformation_color)" }} size='small' variant="contained" onClick={() => { setSelectedTypeName("text_transformation") }}>Text transformation</Button>
            <Button style={{ ...BASE_BUTTON_STYLE, backgroundColor: "var(--json_transformation_color)" }} size='small' variant="contained" onClick={() => { setSelectedTypeName("json_transformation") }}>Json Transformation</Button>
        </div>
        {selectedType && <Dropdown style={{ alignSelf: "center" }}>
            <Dropdown.Toggle variant="success" disabled={isMaxStepsReached} style={{ backgroundColor: `var(--${selectedType.color})`, color: "black", width: "180px" }}>
                {selectedType.name}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {selectedType.form}
            </Dropdown.Menu>
        </Dropdown>}
        <Button style={{ alignSelf: "center" }} size='large' variant="contained" onClick={executeTranformation}>GO</Button>
    </div>
}