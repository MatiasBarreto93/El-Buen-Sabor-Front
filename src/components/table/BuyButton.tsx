import {CartPlus} from "react-bootstrap-icons";

interface Props{
    onClick: () => void;
}

export const BuyButton = ({onClick}:Props) => {
    return(
        <CartPlus
            color={"#34A853"}
            size={24}
            onClick={onClick}
            onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
            onMouseLeave={() => { document.body.style.cursor = 'default' }}
        />
    )
}