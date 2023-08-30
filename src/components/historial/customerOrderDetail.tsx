import {Order} from "../../interfaces/customer.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Card, Col, Row} from "react-bootstrap";
import {ArrowLeft} from "react-bootstrap-icons";
import './../styles/background.css'
import './../mipedido/fullCart/fullCart.css'
import {useEffect, useState} from "react";
import {printDocument} from "../../util/printComponentPDF.ts";

const CustomerOrderDetail = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { order }: { order: Order } = location.state;

    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalSubtotal, setTotalSubtotal] = useState(0);

    useEffect(() => {
        if (order.orderDetails) {
            const sumQuantity = order.orderDetails.reduce((sum, item) => sum + item.quantity, 0);
            const sumSubtotal = order.orderDetails.reduce((sum, item) => sum + item.subtotal, 0);

            setTotalQuantity(sumQuantity);
            setTotalSubtotal(sumSubtotal);
        }
    }, [order.orderDetails]);

    return(
        <>
            <div className="perfil-img">
            <Button className="mt-2 mx-2" onClick={() =>navigate(-1)}><ArrowLeft size={24}/>Volver</Button>
                <div className="d-flex justify-content-center" id="print">
                    <div className="rectangle mt-2 mb-5" style={{width: '95%'}}>
                        <h4 className="title">Pedido #{order.id}</h4>
                        <Row>
                            <Col md={9}>
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
                                                    <p>Subtotal:</p>
                                                    <p>${detail.subtotal}</p>
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
                                                    <p>Subtotal:</p>
                                                    <p>${detail.subtotal}</p>
                                                </Card.Body>
                                            </Col>
                                        </Row>
                                    </Card>
                                } else {
                                    return null;
                                }
                            })}
                            </Col>
                            <Col className="d-flex flex-column border rounded mb-2 mx-3">
                                <div className="mt-2" >
                                    <div className="d-flex justify-content-between mt-2 mb-5">
                                        <h5>Cantidad:</h5>
                                        <h5><strong>{totalQuantity} Productos</strong></h5>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h5>Subtotal:</h5>
                                        <h5><strong>${totalSubtotal}</strong></h5>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h5>Descuento:</h5>
                                        <h5><strong>${order.discount}</strong></h5>
                                    </div>
                                    <div className="mb-5"/>
                                    <div className="d-flex justify-content-between">
                                        <h5 style={{fontWeight: 'bold', color: '#b92020'}}>Total:</h5>
                                        <h5 style={{fontWeight: 'bold', color: '#b92020'}}>${order.total}</h5>
                                    </div>
                                    <div className="mt-5 text-center">
                                        {order.cancelled ? (
                                            <h4 className="border p-1" style={{ color:"#b92020", fontWeight: 'bold' }}>
                                                {order.cancelled && "Cancelado"}
                                            </h4>
                                        ) : (
                                            <h4 className="border p-1" style={{ color: order.paid ? "#34A853" : "#b92020", fontWeight: 'bold' }}>
                                                {order.paid ? "Pagado" : "No Pagado"}
                                            </h4>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <h4 className="title mt-2">Datos del Pedido</h4>
                        <Row className="border rounded mb-2 mx-1">
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Nombre:</p>
                                <p>{order.customerName}</p>
                            </Col>
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Apellido:</p>
                                <p>{order.customerLastname}</p>
                            </Col>
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Tiempo Estimado:</p>
                                <p>{order.estimatedTime}'</p>
                            </Col>
                        </Row>

                        {order.deliveryTypeId === 1 &&(
                            <Row className="border rounded mb-2 mx-1">
                                <Col>
                                    <p style={{ fontWeight: "bold" }}>Telefono:</p>
                                    <p>{order.phone}</p>
                                </Col>
                                <Col>
                                    <p style={{ fontWeight: "bold" }}>Direccion:</p>
                                    <p>{order.address}</p>
                                </Col>
                                <Col>
                                    <p style={{ fontWeight: "bold" }}>Departamento:</p>
                                    <p>{order.apartment}</p>
                                </Col>
                            </Row>
                        )}

                        <Row className="border rounded mb-2 mx-1">
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Forma de Entrega:</p>
                                <p>{order.deliveryTypeId === 1 ? "Envio a Domicilio" : "Retiro en local"}</p>
                            </Col>
                        </Row>

                        <Row className="border rounded mb-2 mx-1">
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Forma de Pago:</p>
                                <p>{order.paymentTypeId === 1 ? "Efectivo" : "MercadoPago"}</p>
                            </Col>
                        </Row>
                        <div className="mt-5 mb-5 text-center" id="ignore">
                            <Button onClick={() => printDocument()}>Descargar la Factura</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerOrderDetail;