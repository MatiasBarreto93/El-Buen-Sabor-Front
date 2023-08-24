import {PlusLg} from "react-bootstrap-icons";
import {useState} from "react";

interface Props{
    onClick: () => void;
}

export const AddTimeButton = ({onClick}:Props) => {

    const [hover, setHover] = useState(false);

    return(
        <div className="d-flex align-items-center"
             onClick={onClick}
             onMouseEnter={() => {document.body.style.cursor = 'pointer';setHover(true);}}
             onMouseLeave={() => {document.body.style.cursor = 'default';setHover(false);}}
             style={{border: '2px solid #D32F2F', borderRadius: '4px', paddingLeft: '4px', paddingRight: '8px', color: hover ? '#D32F2F' : '#FFF', backgroundColor: hover ? '#FFF' : '#D32F2F'}}
        >
            <PlusLg color={hover ? '#D32F2F' : '#FFF'} size={24}/>
            <div style={{fontWeight: 'bold', color: hover ? '#D32F2F' : '#FFF'}}>10' Min</div>
        </div>
    )
}

