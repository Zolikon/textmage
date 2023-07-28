
import { useRef } from "react"
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';
import Button from '@mui/material/Button';

export function Help({ children }) {

    const dialogRef = useRef(null)

    return <div>
        <IconButton onClick={() => dialogRef.current.showModal()} aria-label="help">
            <HelpIcon />
        </IconButton>
        <dialog ref={dialogRef} style={{ backgroundColor: "black", color: "white" }}>
            {children}
            <br />
            <Button size='small' variant="contained" onClick={() => dialogRef.current.close()}>Helpful, thank you</Button>

        </dialog>
    </div>
}