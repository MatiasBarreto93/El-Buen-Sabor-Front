import {Button, Col, Form, Image, Modal, Row} from "react-bootstrap";
import {CartPlus} from "react-bootstrap-icons";
import './../../styles/productCard.css'

interface Props{
    show: boolean;
    onHide: () => void;
    name: string;
    description: string;
    sellPrice: number;
    image: string;
}

export const ProductDetailModal = ({show, onHide ,name, description, sellPrice, image}:Props) => {

    return(
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title><strong>{name}</strong></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={6} sm={6} md={6}>
                        <Image rounded={true} fluid src={`data:image/jpeg;base64,${image}`} style={{maxHeight: "250px"}}/>
                    </Col>
                    <Col xs={6} sm={6} md={6} className="product-detail-body">
                        <div className="description-container">
                            <h5>Descripción:</h5>
                            <p className="description">{description}</p>
                        </div>
                        <h5 className="text-center" style={{color: "#b92020"}}><strong>${sellPrice}</strong></h5>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Form.Control
                    size={"sm"}
                    name="quantity"
                    type="number"
                    min={1}
                    max={99}
                    placeholder={"1"}
                    className="custom-quantity"
                />
                <Button className="w-50"><CartPlus size={20}/> Agregar</Button>
            </Modal.Footer>
        </Modal>
    )
}