import {Button, Col, Form, Image, Modal, Row} from "react-bootstrap";
import {CartPlus} from "react-bootstrap-icons";
import './../../styles/productCard.css'
import React, {useEffect, useState} from "react";

interface Props{
    show: boolean;
    onHide: () => void;
    name: string;
    description: string;
    sellPrice: number;
    image: string;
    quantity: number;
    handleAddedtoCartClick:() => void;
    handleQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductDetailModal = ({show, onHide ,name, description, sellPrice, image, quantity, handleAddedtoCartClick, handleQuantityChange}:Props) => {

    const [quantityDetail, setQuantityDetail] = useState(1);

    useEffect(() => {
        setQuantityDetail(quantity);
    }, [quantity]);

    const handleQuantityDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const quantityValue = Number(event.target.value);
        setQuantityDetail(isNaN(quantityValue) ? 1 : Math.max(1, quantityValue));
        //Actualiza la cantidad en el componente padre
        handleQuantityChange(event)
    };

    const handleAdd = () => {
        handleAddedtoCartClick();
        onClose()
    }

    const onClose = () => {
        setQuantityDetail(quantity)
        onHide();
    }

    return(
        <>
        <Modal show={show} onHide={onClose} centered backdrop="static">
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
                    className="custom-quantity"
                    size={"sm"}
                    name="quantity"
                    type="number"
                    min={1}
                    max={99}
                    value={quantityDetail}
                    onChange={handleQuantityDetailChange}
                />
                <Button className="w-50" onClick={handleAdd}><CartPlus size={20}/> Agregar</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}