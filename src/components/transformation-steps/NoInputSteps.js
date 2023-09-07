import { useEffect } from "react";

export function ToUpperCaseStep({ setTransformer, setTitle }) {
  useEffect(() => setTitle("To upper case"), [setTitle]);

  useEffect(() => {
    setTransformer(() => (input) => input.toUpperCase());
  }, [setTransformer]);
}

export function ToLowerCaseStep({ setTransformer, setTitle }) {
  useEffect(() => setTitle("To lower case"), [setTitle]);

  useEffect(() => {
    setTransformer(() => (input) => input.toLowerCase());
  }, [setTransformer]);
}
