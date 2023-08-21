import {Item} from "../../../interfaces/products.ts";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {CartPlus, InfoCircle} from "react-bootstrap-icons";
import React, {useState} from "react";
import './../../styles/productCard.css'
import {ProductDetailModal} from "./productDetailModal.tsx";
import {ProductAdded} from "./productAdded.tsx";
import {useCart} from "../../../context/cart/CartContext.tsx";

interface Props{
    item: Item;
}

export const ProductoCard = React.forwardRef<HTMLDivElement, Props>(({ item }, ref) =>{

    const {addToCart} = useCart();

    const [quantity, setQuantity] = useState(1);

    const [showInfo, setShowInfo] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);

    const [showAddedtoCart, setShowAddedtoCart] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);

    //Info Button
    const handleInfoClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setShowInfo(true)
        setShowModalInfo(true);
    };

    //Add to Cart Button
    const handleAddedtoCartClick = () => {
        addToCart(item,quantity);
        setShowAddedtoCart(true)
        setShowModalAdd(true);
        setShowModalInfo(false)
    };

    //Quantity
    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        const quantityValue = Number(event.target.value);
        let quantity = isNaN(quantityValue) ? 1 : Math.max(1, quantityValue);
        quantity = Math.min(quantity, item.currentStock);
        setQuantity(quantity);
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
                    <Row>
                        <Col xs={3} sm={3} md={3}>
                            <Form.Control
                                size={"sm"}
                                name="quantity"
                                type="number"
                                min={1}
                                max={item.currentStock}
                                className="custom-quantity"
                                value={quantity}
                                onChange={handleQuantityChange}
                                disabled={item.currentStock === 0}
                            />
                        </Col>
                        <Col xs={9} sm={9} md={9}>
                            <Button className="w-100" onClick={handleAddedtoCartClick} disabled={item.currentStock === 0}>
                                <CartPlus size={20}/> {item.currentStock === 0 ? "No disponible" : "Agregar"}
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {showInfo && (
                <ProductDetailModal
                    show={showModalInfo}
                    onHide={() => setShowModalInfo(false)}
                    name={item.name}
                    description={item.description}
                    sellPrice={item.sellPrice}
                    image={item.image}
                    quantity={quantity}
                    maxQuantity={item.currentStock}
                    handleAddedtoCartClick={handleAddedtoCartClick}
                    handleQuantityChange={handleQuantityChange}
                />
            )}
            {showAddedtoCart && (
                <ProductAdded
                    show={showModalAdd}
                    onHide={() => setShowModalAdd(false)}
                    name={item.name}
                    sellPrice={item.sellPrice}
                    image={item.image}
                    quantity={quantity}
                />
            )}
        </>
    )
});