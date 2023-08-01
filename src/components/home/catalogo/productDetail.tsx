import {useParams, useNavigate} from "react-router-dom";
import {Drink, Product} from "../../../interfaces/products.ts";
import {useGenericGet} from "../../../services/useGenericGet.ts";
import './../../mipedido/fullCart/fullCart.css'
import './../../styles/productCard.css'
import './../../styles/background.css'
import {Button, Col, Form, Image, Row} from "react-bootstrap";
import {ArrowLeftCircleFill, CartPlus} from "react-bootstrap-icons";
import React, {useState} from "react";
import {ProductAdded} from "./productAdded.tsx";


type ItemDetail = Product | Drink;

const ProductDetail = () => {

    //Setting endpoing and Item
    const {type, id} = useParams();
    let endpoint = "";
    // Conditions are kept outside useEffect
    if (type === "2"){
        endpoint = `products/${id}`;
    } else if (type === "3") {
        endpoint = `drinks/${id}`;
    }
    const item: ItemDetail = useGenericGet<ItemDetail>(endpoint, "Item");

    //Quantity
    const [quantity, setQuantity] = useState(1);
    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const quantityValue = Number(event.target.value);
        let quantity = isNaN(quantityValue) ? 1 : Math.max(1, quantityValue);
        quantity = Math.min(quantity, item.currentStock);
        setQuantity(quantity);
    };

    //ADD To Cart
    const [showAddedtoCart, setShowAddedtoCart] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const handleAddedtoCartClick = () => {
        setShowAddedtoCart(true)
        setShowModalAdd(true);
    };

    //Back Button
    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate("/");
    };

    return(
        <>
            <div className="perfil-img">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="rectangle mt-5" style={{position: "relative"}}>
                        <div className="m-3" style={{position: "absolute", top: '0', right: '0'}}>
                            <ArrowLeftCircleFill
                                size={32}
                                color={"#b92020"}
                                onClick={handleBackClick}
                                onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
                                onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            />
                        </div>
                        <div>
                            <Row>
                                <Col>
                                    <Image fluid rounded={true}
                                           src={`data:image/jpeg;base64,${item.image}`}
                                           alt={item.name}
                                           style={{ maxHeight: '500px', minWidth: '200px', objectFit: 'cover' }}
                                    />
                                </Col>
                                <Col className="product-detail-body">
                                    <div className="d-flex justify-content-between">
                                        <h2 className="mt-5" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{item.name}</h2>
                                    </div>
                                    <div className="description-container">
                                        <h6>Descripción:</h6>
                                        <p className="description">{item.description}</p>
                                    </div>
                                    <div>Unidades Disponibles: {item.currentStock}</div>
                                    <h5 className="text-center" style={{color: "#b92020"}}><strong>${item.sellPrice}</strong></h5>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-center mt-3">
                                <div className="mx-2">
                                    <Form.Control
                                        size={"sm"}
                                        name="quantity"
                                        type="number"
                                        min={1}
                                        max={item.currentStock}
                                        className="custom-quantity"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                    />
                                </div>
                                <div className="d-flex justify-content-center align-items-center ml-2 w-50">
                                    <Button className="w-100" onClick={handleAddedtoCartClick}><CartPlus size={20}/> Agregar</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
}

export default ProductDetail;