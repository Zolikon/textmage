import { useReducer } from "react"


const INITIAL_STATE = {
    isHover: false,
    top: 0,
    left: 0
}

function reducer(state, { type, payload }) {
    switch (type) {
        case "mouseEnter":
        case "mouseMove":
            return { ...state, isHover: true, top: payload.y + 5, left: payload.x + 5 }
        case "mouseLeave":
            return { ...state, isHover: false }
        default:
            throw new Error("not supported operation")
    }
}

export function Help({ children }) {
    const [{ isHover, top, left }, dispatcher] = useReducer(reducer, INITIAL_STATE)

    return <div>
        <div
            onMouseEnter={(e) => dispatcher({ type: "mouseEnter", payload: { x: e.pageX, y: e.pageY } })}
            onMouseLeave={() => dispatcher({ type: "mouseLeave" })}
            onMouseMove={(e) => dispatcher({ type: "mouseMove", payload: { x: e.pageX, y: e.pageY } })}
        >❓</div>
        {isHover && <div style={{ top: top + "px", left: left + "px", position: "fixed" }}>
            {children}
        </div>}
    </div>
}