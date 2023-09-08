import {Item} from "../../../interfaces/products.ts";
import {Button, Card, Col, Row} from "react-bootstrap";
import {CartCheck, CartPlus, InfoCircle} from "react-bootstrap-icons";
import React, {useEffect, useState} from "react";
import './../../styles/productCard.css'
import {ProductDetailModal} from "./productDetailModal.tsx";
import {ProductAdded} from "./productAdded.tsx";
import {useCart} from "../../../context/cart/CartContext.tsx";

interface Props{
    item: Item;
}

export const ProductoCard = React.forwardRef<HTMLDivElement, Props>(({ item }, ref) =>{

    const {items , addToCart} = useCart();

    const [showInfo, setShowInfo] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);

    const [showAddedtoCart, setShowAddedtoCart] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);

    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        setIsInCart(items.some(cartItem => cartItem.id === item.id));
    }, [items, item.id]);


    //Info Button
    const handleInfoClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowInfo(true)
        setShowModalInfo(true);
    };

    //Add to Cart Button
    const handleAddedtoCartClick = () => {
        addToCart(item,1);
        setShowAddedtoCart(true)
        setShowModalAdd(true);
        setShowModalInfo(false)
    };

    return(
        <>
            <Card
                ref={ref}
                style={{overflow:"hidden", position: "relative"}}
                className="card-product"
            >
                <div className="icon-info">
                    <InfoCircle
                        size={24}
                        color="#FFF"
                        onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
                        onMouseLeave={() => {document.body.style.cursor = 'default'}}
                        onClick={handleInfoClick}
                    />
                </div>
                <Card.Img src={item.image} className={"card-prod-img"}/>
                <Card.Body className="body-cart-content">
                    <Card.Title className={"text-center"}><strong>{item.name}</strong></Card.Title>
                    <Card.Text className={"text-center"} style={{color: "#b92020"}} ><strong>${item.sellPrice}</strong></Card.Text>
                    <Row className="justify-content-center">
                        <Col xs={9} sm={9} md={9}>
                            {isInCart ? (
                                <Button className="w-100" style={{color: '#FFF', background: '#34A853', borderColor: '#34A853'}}>
                                    <CartCheck size={24}/> En Carrito
                                </Button>
                                ) : (
                                <Button className="w-100" onClick={handleAddedtoCartClick} disabled={item.currentStock === 0}>
                                    <CartPlus size={24}/> {item.currentStock === 0 ? "No disponible" : "Agregar"}
                                </Button>
                                )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {showInfo && (
                <ProductDetailModal
                    show={showModalInfo}
                    onHide={() => setShowModalInfo(false)}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    sellPrice={item.sellPrice}
                    image={item.image}
                    quantity={1}
                    maxQuantity={item.currentStock}
                    handleAddedtoCartClick={handleAddedtoCartClick}
                />
            )}
            {showAddedtoCart && (
                <ProductAdded
                    show={showModalAdd}
                    onHide={() => setShowModalAdd(false)}
                    name={item.name}
                    sellPrice={item.sellPrice}
                    image={item.image}
                    quantity={1}
                />
            )}
        </>
    )
});