import {XCircle} from "react-bootstrap-icons";

interface Props{
    onClick: () => void;
}

export const CancelButton = ({onClick}:Props) => {
    return(
        <XCircle
            color="#D32F2F"
            size={24}
            onClick={onClick}
            onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
            onMouseLeave={() => { document.body.style.cursor = 'default' }}
        />
    )
}