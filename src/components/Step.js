import React, { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditIcon from "@mui/icons-material/Edit";
import { ArrowDownward } from "@mui/icons-material";
import { Help } from "./Help";
import { useSteps } from "./StepContext";
import { Switch } from "@mui/material";

function translateTypeToClass(type) {
  switch (type) {
    case "json_transformation":
      return "json-transformation-step";
    case "transformation":
      return "transformation-step";
    case "filter":
      return "filter-step";
    default:
      return "";
  }
}

export function Step({ type, id, allowLineByLineProcessing, children }) {
  const { updateStep, moveStepUp, moveStepDown, closeStep } = useSteps();

  const [lineByLine, setLineByLine] = useState(allowLineByLineProcessing);
  const [disabled, setDisabled] = useState(false);
  const [title, setTitle] = useState("");
  const [transformer, setTransformer] = useState((input) => {});
  const [help, setHelp] = useState(null);
  const [titleEditMode, setTitleEditMode] = useState(false);
  const changeTitleInputRef = useRef();

  const modifiedChildren = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      setTransformer: setTransformer,
      disabled: disabled,
      setTitle: setTitle,
      setHelp: setHelp,
    });
  });

  useEffect(() => {
    if (titleEditMode) {
      changeTitleInputRef.current.focus();
    }
  }, [titleEditMode]);

  useEffect(() => {
    updateStep({
      id,
      title,
      disabled,
      transformer,
      lineByLine,
    });
  }, [id, title, disabled, transformer, title, help, lineByLine]);

  const classNames = [
    translateTypeToClass(type),
    disabled ? "step disabled-step prevent-select" : "step prevent-select",
  ].join(" ");

  return (
    <div className={classNames}>
      {titleEditMode ? (
        <div style={{ display: "flex" }}>
          <input
            ref={changeTitleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTitleEditMode(false);
              }
            }}
          />
          <IconButton onClick={() => setTitleEditMode(false)}>
            <CheckIcon />
          </IconButton>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-start", width: "40%" }}>
          <div
            className={disabled ? "prevent-select step-title disabled-step" : "prevent-select step-title"}
            style={{ whiteSpace: "nowrap" }}
            onDoubleClick={() => setTitleEditMode(true)}
          >
            {title}
          </div>
          <IconButton onClick={() => setTitleEditMode(true)}>
            <EditIcon />
          </IconButton>
        </div>
      )}
      <div className="step-actions">
        {allowLineByLineProcessing && (
          <div style={{ display: "flex", flexWrap: "none", flexDirection: "column" }} className="toggle-holder">
            <span style={{ whiteSpace: "nowrap", fontSize: "12px" }}>Line by line</span>
            <Switch
              inputProps={{ "aria-label": "controlled" }}
              checked={lineByLine}
              onChange={(e) => setLineByLine(e.target.checked)}
            />
          </div>
        )}
        <IconButton onClick={() => moveStepUp(id)} aria-label="moveup">
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton onClick={() => moveStepDown(id)} aria-label="movedown">
          <ArrowDownward />
        </IconButton>
        {help && <Help>{help}</Help>}
        <IconButton onClick={() => setDisabled((disabledStatus) => !disabledStatus)} aria-label="disable">
          {disabled ? <CheckIcon /> : <BlockIcon />}
        </IconButton>
        <IconButton onClick={() => closeStep(id)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </div>
      <div className="step-inputs">{modifiedChildren}</div>
    </div>
  );
}
