import {useLocation, useNavigate} from "react-router-dom";
import {Order} from "../../interfaces/customer.ts";
import {Button, Card, Col, Row} from "react-bootstrap";
import {ArrowLeft} from "react-bootstrap-icons";
import {RecipeButton} from "../table/RecipeButton.tsx";
import {useState} from "react";
import {Product} from "../../interfaces/products.ts";
import {BackButton} from "../table/BackButton.tsx";

const KitchenOrderDetail = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { order }: { order: Order } = location.state;

    const [showRecipe, setShowRecipe] = useState(false);
    const [item, setItem] = useState<Product | undefined>(undefined);

    const handleViewRecipe = (itemProduct: Product | undefined) => {
        setItem(itemProduct);
        setShowRecipe(true);
    }

    console.log(JSON.stringify(item,null,2))

    return(
        <>
            <div className="perfil-img">
                <Button className="mt-2 mx-2" onClick={() =>navigate(-1)}><ArrowLeft size={24}/>Volver</Button>
                <div className="d-flex justify-content-center" id="print">
                    <div className="rectangle mt-2 mb-5" style={{width: '95%'}}>
                        <h4 className="title">Pedido #{order.id}</h4>
                        <Row>
                            <Col>
                                {order.orderDetails.map(detail => {
                                    if (detail.itemProduct && Object.keys(detail.itemProduct).length > 0) {
                                        return <Card className="mb-2" key={detail.itemId}>
                                            <Row className="no-gutters">
                                                <Col>
                                                    <Card.Img
                                                        src={detail.itemProduct.image}
                                                        style={{maxWidth: "100px" , maxHeight: "100px", minHeight: "100px", minWidth: "100px"}}
                                                        className="mt-2 my-2 mx-2"
                                                    />
                                                </Col>
                                                <Col>
                                                    <Card.Body>
                                                        <Card.Title>{detail.itemProduct.name}</Card.Title>
                                                    </Card.Body>
                                                </Col>
                                                <Col>
                                                    <Card.Body>
                                                        <p>Cantidad:</p>
                                                        <p>{detail.quantity}</p>
                                                    </Card.Body>
                                                </Col>
                                                <Col>
                                                    <Card.Body>
                                                        {!showRecipe ? (
                                                            <RecipeButton onClick={() => handleViewRecipe(detail.itemProduct)}/>
                                                        ) : (
                                                            <BackButton onClick={() => setShowRecipe(false)}/>
                                                        )}
                                                    </Card.Body>
                                                </Col>
                                            </Row>
                                        </Card>
                                    } else if (detail.itemDrink && Object.keys(detail.itemDrink).length > 0) {
                                        return <Card className="mb-2" key={detail.itemId}>
                                            <Row className="no-gutters">
                                                <Col>
                                                    <Card.Img
                                                        src={detail.itemDrink.image}
                                                        style={{maxWidth: "100px" , maxHeight: "100px", minHeight: "100px", minWidth: "100px"}}
                                                        className="mt-2 my-2 mx-2"
                                                    />
                                                </Col>
                                                <Col>
                                                    <Card.Body>
                                                        <Card.Title>{detail.itemDrink.name}</Card.Title>
                                                    </Card.Body>
                                                </Col>
                                                <Col>
                                                    <Card.Body>
                                                        <p>Cantidad:</p>
                                                        <p>{detail.quantity}</p>
                                                    </Card.Body>
                                                </Col>
                                                <Col>
                                                    <Card.Body>
                                                    </Card.Body>
                                                </Col>
                                            </Row>
                                        </Card>
                                    } else {
                                        return null;
                                    }
                                })}
                            </Col>
                            {showRecipe && (
                                <Col>
                                    <h4 className="title">Receta de {item?.name}</h4>
                                    <div>
                                        <h5>Receta:</h5>
                                    </div>
                                    <div>
                                        {item?.recipeDescription}
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </div>
                </div>
            </div>
        </>
    )
}

export default KitchenOrderDetail;