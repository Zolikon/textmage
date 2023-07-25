import { useEffect } from "react"





export function ToUpperCaseStep({ setTransformer, setTitle }) {

    useEffect(() => {
        setTitle("To upper case")
        setTransformer(() => (input) => input.toUpperCase())
    }, [setTransformer, setTitle])

}

export function ToLowerCaseStep({ setTransformer, setTitle }) {

    useEffect(() => {
        setTitle("To lower case")
        setTransformer(() => (input) => input.toLowerCase())
    }, [setTransformer, setTitle])

}