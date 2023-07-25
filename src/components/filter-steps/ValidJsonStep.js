import { useEffect } from "react"

export function ValidJsonStep({ setTransformer, setTitle }) {

    useEffect(() => {
        setTitle("Keep valid json only")
        setTransformer(() => (input) => {
            try {
                JSON.parse(input);
                return input;
            } catch {
                return null;
            }
        })
    }, [setTransformer, setTitle])

}