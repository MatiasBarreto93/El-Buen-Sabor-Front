import {Button, Col, Image, Modal, Row} from "react-bootstrap";
import './../../styles/productCard.css'
import {useNavigate} from "react-router-dom";

interface Props{
    show: boolean;
    onHide: () => void;
    name: string;
    sellPrice: number;
    image: string;
    quantity: number
}

export const ProductAdded = ({show, onHide ,name, sellPrice, image, quantity}:Props) => {

    const navigate = useNavigate();

    return(
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title><strong>Tu producto se agrego al Carrito</strong></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={6} sm={6} md={6}>
                        <Image rounded={true} fluid src={`data:image/jpeg;base64,${image}`} style={{maxHeight: "250px"}}/>
                    </Col>
                    <Col xs={6} sm={6} md={6} className="product-detail-body">
                        <div className="description-container">
                            <h5 className="description-added">{name}</h5>
                            <h5 style={{color: "#b92020"}}><strong>${sellPrice}</strong></h5>
                            <p className="description">Cantidad:{quantity}</p>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <div style={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                    <Button style={{ flex: '1', margin: '0 5px' }} variant={"secondary"} onClick={onHide}>Continuar Comprando</Button>
                    <Button style={{ flex: '1', margin: '0 5px' }} onClick={() => navigate('/mipedido')}>Ir a Mi Pedido</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}