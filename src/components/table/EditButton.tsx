import {PencilFill} from "react-bootstrap-icons";

interface Props{
    onClick: () => void;
}

export const EditButton = ({onClick}:Props) => {

    return(
        <PencilFill
            color="#FBC02D"
            size={24}
            onClick={onClick}
            onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
            onMouseLeave={() => { document.body.style.cursor = 'default' }}
        />
    )
}