import {Button} from "react-bootstrap";
import './empyCart.css'
import '../fullCart/fullCart.css'
import {useNavigate} from "react-router-dom";

export const EmpyCart = () => {

    const navigate = useNavigate();

    return(
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="rectangle text-center "
                 style={{
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     alignItems: 'center',
                     minHeight: '509px',
                     width: "80%",
                     marginTop: "80px"
                 }}>
                <h4>Tu orden está vacía</h4>
                <Button className="btn-cart-shadow" onClick={() => navigate('/')}>¡Empezar a Comprar!</Button>
            </div>
        </div>
    )
}