import {ArrowLeft} from "react-bootstrap-icons";

interface Props{
    onClick: () => void;
}

export const BackButton = ({onClick}:Props) => {
    return(
        <ArrowLeft
            color="#D32F2F"
            size={24}
            onClick={onClick}
            onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
            onMouseLeave={() => { document.body.style.cursor = 'default' }}
        />
    )
}