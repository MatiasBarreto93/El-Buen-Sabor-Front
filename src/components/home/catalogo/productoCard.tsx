import {Card, Col, Collapse, Row} from "react-bootstrap";
import './../../styles/productCard.css'
import {Item} from "../../../interfaces/products.ts";
import {CartPlus, Check2, InfoCircle, X} from "react-bootstrap-icons";
import {useState} from "react";

interface Props{
    item: Item;
}

export const ProductoCard = ({item}:Props) =>{

    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [showInfo, setShowInfo] = useState(false);


    const handleOnCartClick = () => {
        setIsOpen(!isOpen);
        setActive(!active);
    };

    const handleOnHover = () => {
        setIsHovering(!isHovering);
    };

    const handleInfoClick = () => {
        setShowInfo(!showInfo);
    };



    return(
        <Card
            style={{overflow:"hidden", position: "relative"}}
            className="card-product"
            onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
            onMouseLeave={() => {document.body.style.cursor = 'default'; if (showInfo) handleInfoClick();}}
        >
            <div className="icon-info">
                <InfoCircle size={24} color="#FFF" onClick={handleInfoClick} />
            </div>
            <div
                className="card-prod-img"
                style={{background: `url(data:image/jpeg;base64,${item.image}) center / cover`}}
            >
                {showInfo &&
                    <div className="info-container">
                        <p className="info-text">{item.description}</p>
                    </div>
                }
            </div>
            <Card.Body
                className="content"
                style={{ backgroundColor: active ? '#c6eccd' : '#f8f9fa' }}
                onMouseEnter={handleOnHover}
                onMouseLeave={handleOnHover}
            >
                <Collapse in={!isOpen}>
                    <Row>
                        <Col xs={9} sm={9} md={9}>
                            <Card.Title as="h5" className="text-card-cart"><strong>{item.name}</strong></Card.Title>
                            <Card.Text as="h6" className="text-card-cart"><p>${item.sellPrice}</p></Card.Text>
                        </Col>
                        <Col xs={3} sm={3} md={3} className="d-flex align-items-center justify-content-center icon-cart">
                            <CartPlus size={32} color="#34A853" onClick={handleOnCartClick}/>
                        </Col>
                    </Row>
                </Collapse>
                <Collapse in={isOpen}>
                    <Row>
                        {isHovering ?
                            <Col xs={3} sm={3} md={3} className="d-flex align-items-center justify-content-center icon-close">
                                <X size={32} color="#D32F2F" onClick={handleOnCartClick} />
                            </Col>
                            :
                            <Col xs={3} sm={3} md={3} className="d-flex align-items-center justify-content-center icon-check">
                                <Check2 size={32} color="#34A853" onClick={handleOnCartClick} />
                            </Col>}
                        <Col xs={9} sm={9} md={9}>
                            <Card.Title as="h5" className="text-card-add"><strong>{item.name}</strong></Card.Title>
                            <Card.Text as="h6" className="text-card-add"><p>Agregado al Carrito</p></Card.Text>
                        </Col>
                    </Row>
                </Collapse>
            </Card.Body>
        </Card>
    )
}