import {Item} from "../../../interfaces/products.ts";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import './../../styles/productCard.css'
import {CartPlus} from "react-bootstrap-icons";
interface Props{
    item: Item;
}

export const ProductoCard = ({item}:Props) =>{
    return(
        <>
            <Card
                style={{overflow:"hidden", position: "relative"}}
                className="card-product"
                onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
                onMouseLeave={() => {document.body.style.cursor = 'default'}}
            >

            <Card.Img src={`data:image/jpeg;base64,${item.image}`} className={"card-prod-img"}/>
                <Card.Body className="body-cart-content">
                    <Card.Title className={"text-center"}><strong>{item.name}</strong></Card.Title>
                    <Card.Text className={"text-center"} style={{color: "#0d86c4"}} ><strong>${item.sellPrice}</strong></Card.Text>
                    <Row>
                        <Col xs={3} sm={3} md={3}>
                            <Form.Control
                                size={"sm"}
                                name="quantity"
                                type="number"
                                min={1}
                                max={99}
                                placeholder={"1"}
                                className="custom-quantity"
                            />
                        </Col>
                        <Col xs={9} sm={9} md={9}>
                            <Button className="w-100"><CartPlus size={20}/> Agregar</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}