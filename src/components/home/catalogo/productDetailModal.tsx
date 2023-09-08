import {Button, Col, Image, Modal, Row} from "react-bootstrap";
import {CartCheck, CartPlus} from "react-bootstrap-icons";
import './../../styles/productCard.css'
import {useEffect, useState} from "react";
import {useCart} from "../../../context/cart/CartContext.tsx";

interface Props{
    show: boolean;
    onHide: () => void;
    id: number;
    name: string;
    description: string;
    sellPrice: number;
    image: string;
    quantity: number;
    maxQuantity:number
    handleAddedtoCartClick:() => void;
}

export const ProductDetailModal = ({show, onHide, id ,name, description, sellPrice, image,maxQuantity, handleAddedtoCartClick}:Props) => {

    const {items} = useCart();
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        setIsInCart(items.some(cartItem => cartItem.id === id));
    }, [items, id]);

    const handleAdd = () => {
        handleAddedtoCartClick();
        onClose()
    }

    const onClose = () => {
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
                        <Image rounded={true} fluid src={image} style={{maxHeight: "250px"}}/>
                    </Col>
                    <Col xs={6} sm={6} md={6} className="product-detail-body">
                        <div className="description-container">
                            <h5>Descripción:</h5>
                            <p className="description">{description}</p>
                        </div>
                        <div>Unidades Disponibles: {maxQuantity}</div>
                        <h5 className="text-center" style={{color: "#b92020"}}><strong>${sellPrice}</strong></h5>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                {isInCart ? (
                    <Button className="w-50" style={{color: '#FFF', background: '#34A853', borderColor: '#34A853'}}>
                        <CartCheck size={24}/> En Carrito
                    </Button>
                ) : (
                    <Button className="w-50" onClick={handleAdd} disabled={maxQuantity === 0}>
                        <CartPlus size={24}/> {maxQuantity === 0 ? "No disponible" : "Agregar"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
        </>
    )
}