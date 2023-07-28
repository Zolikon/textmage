import { useEffect } from "react"

export function ValidJsonStep({ setTransformer, setTitle, setHelp }) {

    useEffect(() => {
        setTitle("Keep valid json only")
        setHelp(<>
            <h2>Filters for valid json</h2>
            <div>Input is kept only if it can be parsed to json by <a target="_blank" rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse">JSON.parse()</a> method</div>
        </>)
        setTransformer(() => (input) => {
            try {
                JSON.parse(input);
                return input;
            } catch {
                return null;
            }
        })
    }, [setTransformer, setTitle, setHelp])

}