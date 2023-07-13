import {Button} from "react-bootstrap";
import {Dash, Plus} from "react-bootstrap-icons";

interface Props{
    increment: () => void;
    decrement: () => void;
    count: number;
}
export  const QuantityButton = ({increment, decrement, count}: Props) => {
    return(
        <div className="d-flex" style={{ flexWrap: 'nowrap' }}>
            <Button size="sm" variant={"secondary"} onClick={decrement}><Dash size={16} color={"#ffffff"}/></Button>
            <span className="mx-1 p-1 border">{count}</span>
            <Button size="sm" variant={"secondary"} onClick={increment}><Plus size={16} color={"#ffffff"}/></Button>
        </div>
    )
}