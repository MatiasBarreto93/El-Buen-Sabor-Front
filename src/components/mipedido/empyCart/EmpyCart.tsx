import {Button, Container} from "react-bootstrap";
import './empyCart.css'

export const EmpyCart = () => {

    return(
        <Container fluid className="block">
            <Container fluid className="btnCart">
                <h4>Tu orden está vacía</h4>
                <Button className="btn-cart-shadow">¡Empezar a Comprar!</Button>
            </Container>
        </Container>
    )
}