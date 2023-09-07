import { useEffect, useMemo, useState } from "react";

import TextField from "@mui/material/TextField";
import { MenuItem, Select } from "@mui/material";

const TEXT_ALIGNMENT = {
  sx: {
    "& input": {
      textAlign: "center",
    },
  },
};

export function CsvToJsonLinesStep({ setTransformer, disabled, setTitle, setHelp }) {
  const [header, setHeader] = useState("");
  const [separator, setSeparator] = useState("");

  const transformer = useMemo(
    () =>
      function toJson(input) {
        const headers = header.split(separator);
        const values = input.split(separator);
        if (headers.length !== values.length) {
          return null;
        }
        let result = {};
        for (let i = 0; i < headers.length; i++) {
          result[headers[i]] = values[i];
        }
        return JSON.stringify(result);
      },
    [header, separator]
  );

  useEffect(() => setTitle("Csv to json lines"), [setTitle]);

  useEffect(() => {
    setHelp(
      <>
        <h2>CSV input to JSON output</h2>
        <div>Converts comma separated values to json output</div>
        <div>
          <strong>Configuration:</strong>
        </div>
        <div>Header is the column headers separated by the configured separator</div>
        <div>Separator is what separates values in the input</div>
        <br />
        <div>
          <strong>Example:</strong>
        </div>
        <div>
          Input <code>1;hello world;["a","b"]</code>, header <code>a;b;c</code>, separator: ','
        </div>
        <div>
          Output will be <code>{'{"a":"1", "b":"hello world", "c":"[\\"a\\", \\"b\\"]"}'}</code>
        </div>
        <div>
          Note: every field will be string, but they can be extracted to other format with the 'Json field converter'
          step
        </div>
      </>
    );
    setTransformer(() => transformer);
  }, [header, separator, setTransformer, transformer, setHelp]);

  return (
    <>
      <TextField
        className="input-action"
        type="text"
        label="Header"
        InputProps={TEXT_ALIGNMENT}
        style={{ width: "150px" }}
        size="small"
        value={header}
        onChange={(event) => setHeader(event.target.value)}
        disabled={disabled}
      />
      <TextField
        className="input-action"
        type="text"
        label="Separator"
        InputProps={TEXT_ALIGNMENT}
        style={{ width: "150px" }}
        size="small"
        value={separator}
        onChange={(event) => setSeparator(event.target.value)}
        disabled={disabled}
      />
    </>
  );
}

function getJsonFieldConverter(type) {
  switch (type) {
    case "number":
      return (input) => Number(input);
    case "array":
    case "nested_object":
      return (input) => JSON.parse(input);
    default:
      throw new Error("not supported json field converter");
  }
}

export function JsonFieldConverterStep({ setTransformer, disabled, setTitle, setHelp }) {
  const [field, setField] = useState("");
  const [convertsionType, setConvertsionType] = useState("number");

  const transformer = useMemo(
    () =>
      function toJson(input) {
        let result = null;
        try {
          const json = JSON.parse(input);
          if (!json[field]) {
            return null;
          }
          json[field] = getJsonFieldConverter(convertsionType)(json[field]);
          result = JSON.stringify(json);
        } catch {
          return null;
        }
        return result;
      },
    [field, convertsionType]
  );

  useEffect(() => setTitle("Json field converter"), [setTitle]);

  useEffect(() => {
    setHelp(
      <>
        <h2>Json field converter</h2>
        <div>Assumes input is valid json, if not input will be dropped</div>
        <div>
          <strong>Configuration:</strong>
        </div>
        <div>Type is what you want the field to be converted</div>
        <div>Field is which field to convert</div>
        <br />
        <div>
          <strong>Example:</strong>
        </div>
        <div>
          Input <code>{'{"a":"1", "b":"hello world", "c":"[\\"a\\", \\"b\\"]"}'}</code>, type 'Number', field: 'a'
        </div>
        <div>
          Output will be <code>{'{"a":1, "b":"hello world", "c":"[\\"a\\", \\"b\\"]"}'}</code>
        </div>
        <div>Follow up with the a next similar step where type 'Array', field: 'c' </div>
        <div>
          Output will be <code>{'{"a":1, "b":"hello world", "c":["a","b"]}'}</code>
        </div>
        <br />
        <div>
          Note: if the given field does not exist or cannot be transformed to given type the input will be dropped
        </div>
      </>
    );
    setTransformer(() => transformer);
  }, [field, convertsionType, setTransformer, transformer, setHelp]);

  return (
    <>
      <Select
        className="input-action"
        sx={{ m: 1, minWidth: 120 }}
        variant="standard"
        value={convertsionType}
        onChange={(e) => setConvertsionType(e.target.value)}
        label="Type"
      >
        <MenuItem value={"number"}>Number</MenuItem>
        <MenuItem value={"array"}>Array</MenuItem>
        <MenuItem value={"nested_object"}>Nested Object</MenuItem>
      </Select>
      <TextField
        className="input-action"
        type="text"
        label="Field"
        InputProps={TEXT_ALIGNMENT}
        style={{ width: "150px" }}
        size="small"
        value={field}
        onChange={(event) => setField(event.target.value)}
        disabled={disabled}
      />
    </>
  );
}

export function JsonFieldExtractorStep({ setTransformer, disabled, setTitle, setHelp }) {
  const [field, setField] = useState("");

  useEffect(() => setTitle("Json field extractor"), [setTitle]);

  useEffect(() => {
    setHelp(
      <>
        <h2>Json field extractor</h2>
        <div>Assumes input is valid json, if not input will be dropped</div>
        <div>
          <strong>Configuration:</strong>
        </div>
        <div>Field is which to be extracted</div>
        <br />
        <div>
          <strong>Example:</strong>
        </div>
        <div>
          Input <code>{'{"a":1, "b":"hello world", "c":["a","b"]}'}</code>, field: 'c'
        </div>
        <div>
          Output will be <code>["a","b"]</code>
        </div>
        <br />
        <div>Note: if the given field does not exist the input will be dropped</div>
      </>
    );
    setTransformer(() => (input) => {
      try {
        const json = JSON.parse(input);
        return JSON.stringify(json[field]);
      } catch {
        return null;
      }
    });
  }, [field, setTransformer, setHelp]);

  return (
    <>
      <TextField
        className="input-action"
        type="text"
        label="Field"
        InputProps={TEXT_ALIGNMENT}
        style={{ width: "150px" }}
        size="small"
        value={field}
        onChange={(event) => setField(event.target.value)}
        disabled={disabled}
      />
    </>
  );
}

export function JsonFieldRemoverStep({ setTransformer, disabled, setTitle, setHelp }) {
  const [field, setField] = useState("");

  useEffect(() => setTitle("Json field remover"), [setTitle]);

  useEffect(() => {
    setHelp(
      <>
        <h2>Json field remover</h2>
        <div>Assumes input is valid json, if not input will be dropped</div>
        <div>
          <strong>Configuration:</strong>
        </div>
        <div>Field is which to be removed</div>
        <br />
        <div>
          <strong>Example:</strong>
        </div>
        <div>
          Input <code>{'{"a":1, "b":"hello world"}'}</code>, field: 'b'
        </div>
        <div>
          Output will be <code>{'{"a":1}'}</code>
        </div>
        <br />
        <div>Note: if the given field does not exist the input will be dropped</div>
      </>
    );
    setTransformer(() => (input) => {
      try {
        const json = JSON.parse(input);
        delete json[field];
        return JSON.stringify(json);
      } catch {
        return null;
      }
    });
  }, [field, setTransformer, setHelp]);

  return (
    <>
      <TextField
        className="input-action"
        type="text"
        label="Field"
        InputProps={TEXT_ALIGNMENT}
        style={{ width: "150px" }}
        size="small"
        value={field}
        onChange={(event) => setField(event.target.value)}
        disabled={disabled}
      />
    </>
  );
}

export function JsonFieldAdderStep({ setTransformer, disabled, setTitle, setHelp }) {
  const [field, setField] = useState("");
  const [value, setValue] = useState("");

  const transformer = useMemo(
    () =>
      function addField(input) {
        try {
          const result = JSON.parse(input);
          result[field] = value;
          return JSON.stringify(result);
        } catch {
          return null;
        }
      },
    [field, value]
  );

  useEffect(() => setTitle("Json field adder"), [setTitle]);

  useEffect(() => {
    setHelp(
      <>
        <h2>Json field adder</h2>
        <div>Assumes input is valid json, if not input will be dropped</div>
        <div>
          <strong>Configuration:</strong>
        </div>
        <div>{"Field is the the name of the field (can exist)"}</div>
        <div>Value is the new value of the field</div>
        <br />
        <div>
          <strong>Example:</strong>
        </div>
        <div>
          Input <code>{'{"a":1}'}</code>, field <code>b</code>, value: '2'
        </div>
        <div>
          Output will be <code>{'{"a":1, "b":"2"}'}</code>
        </div>
        <div>
          Note: every field will be string, but they can be extracted to other format with the 'Json field converter'
          step
        </div>
      </>
    );
    setTransformer(() => transformer);
  }, [field, value, setTransformer, transformer, setHelp]);

  return (
    <>
      <TextField
        className="input-action"
        type="text"
        label="Field"
        InputProps={TEXT_ALIGNMENT}
        style={{ width: "150px" }}
        size="small"
        value={field}
        onChange={(event) => setField(event.target.value)}
        disabled={disabled}
      />
      <TextField
        className="input-action"
        type="text"
        label="Value"
        InputProps={TEXT_ALIGNMENT}
        style={{ width: "150px" }}
        size="small"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
      />
    </>
  );
}

export function JsonFieldRenamerStep({ setTransformer, disabled, setTitle, setHelp }) {
  const [field, setField] = useState("");
  const [newName, setNewName] = useState("");

  const transformer = useMemo(
    () =>
      function renameField(input) {
        try {
          const result = JSON.parse(input);
          if (Object.keys(result).indexOf(field) === -1) {
            return input;
          }
          const tempValue = result[field];
          delete result[field];
          result[newName] = tempValue;
          return JSON.stringify(result);
        } catch {
          return null;
        }
      },
    [field, newName]
  );

  useEffect(() => setTitle("Json field renamer"), [setTitle]);

  useEffect(() => {
    setHelp(
      <>
        <h2>Json field renamer</h2>
        <div>Assumes input is valid json, if not input will be dropped</div>
        <div>
          <strong>Configuration:</strong>
        </div>
        <div>Field is the the name of the field to be renamed, if not exists input is unchanged</div>
        <div>New name is the new name of the field</div>
        <br />
        <div>
          <strong>Example:</strong>
        </div>
        <div>
          Input <code>{'{"a":1}'}</code>, field <code>a</code>, new name: 'b'
        </div>
        <div>
          Output will be <code>{'{"b":1}'}</code>
        </div>
        <div>
          Note: every field will be string, but they can be extracted to other format with the 'Json field converter'
          step
        </div>
      </>
    );
    setTransformer(() => transformer);
  }, [field, newName, setTransformer, transformer, setHelp]);

  return (
    <>
      <TextField
        className="input-action"
        type="text"
        label="Field"
        InputProps={TEXT_ALIGNMENT}
        style={{ width: "150px" }}
        size="small"
        value={field}
        onChange={(event) => setField(event.target.value)}
        disabled={disabled}
      />
      <TextField
        className="input-action"
        type="text"
        label="New name"
        InputProps={TEXT_ALIGNMENT}
        style={{ width: "150px" }}
        size="small"
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
        disabled={disabled}
      />
    </>
  );
}

export function JsonArrayToJsonLinesStep({ setTransformer, disabled, setTitle, setHelp }) {
  useEffect(() => setTitle("Json array to json lines"), [setTitle]);

  useEffect(() => {
    setHelp(
      <>
        <h2>Json array to json lines</h2>
        <div>Assumes input is valid json, if not input will be dropped</div>
        <br />
        <div>
          <strong>Example:</strong>
        </div>
        <div>
          Input <code>{'[{"a":1}, {"a":2}]'}</code>
        </div>
        <div>
          Output will be
          <pre>
            <code>{'{"a":1}\n{"a":2}'}</code>
          </pre>
        </div>
      </>
    );
    setTransformer(() => (input) => {
      try {
        const json = JSON.parse(input);
        return json.map((t) => JSON.stringify(t)).join("\n");
      } catch {
        return null;
      }
    });
  }, [setTransformer, setHelp]);

  return <></>;
}

export function JsonLinesToJsonArrayStep({ setTransformer, disabled, setTitle, setHelp }) {
  useEffect(() => setTitle("Json lines to json array"), [setTitle]);

  useEffect(() => {
    setHelp(
      <>
        <h2>Json array to json lines</h2>
        <div>Assumes input is valid json, if not input will be dropped</div>
        <br />
        <div>
          <strong>Example:</strong>
        </div>
        <div>
          Input <code>{'[{"a":1}, {"a":2}]'}</code>
        </div>
        <div>
          Output will be
          <pre>
            <code>{'{"a":1}\n{"a":2}'}</code>
          </pre>
        </div>
      </>
    );
    setTransformer(() => (input) => {
      try {
        const result = [];
        input
          .split("\n")
          .map((element) => {
            try {
              return JSON.parse(element);
            } catch {
              return undefined;
            }
          })
          .filter((element) => element !== undefined)
          .forEach((element) => {
            result.push(element);
          });
        return JSON.stringify(result);
      } catch {
        return null;
      }
    });
  }, [setTransformer, setHelp]);

  return <></>;
}
