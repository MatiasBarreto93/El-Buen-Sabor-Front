import {useLocation} from "react-router-dom";
import {Customer, Order, OrderDetail} from "../../../interfaces/customer.ts";
import {useCart} from "../../../context/cart/CartContext.tsx";
import {useEffect, useState} from "react";
import './../../styles/background.css'
import './../fullCart/fullCart.css'
import {Button, Card, Col, Row} from "react-bootstrap";
import {CancelModal} from "../cancelModal/cancelModal.tsx";
import {useGenericPost} from "../../../services/useGenericPost.ts";
const NewOrderDetail = () => {

    const location = useLocation();
    const { cli, paymentType, deliveryType }: { cli: Customer; paymentType: number; deliveryType: number } = location.state;
    const genericPost = useGenericPost();
    //Cart Context
    const {items} = useCart();

    //Cantidad de items,total, subtotal, descuento
    const [itemCount, setItemCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {

        //Nro Items
        const newCount = items.reduce((count, item) => count + item.quantity, 0);

        //SubTotal
        const newSubTotal = items.reduce((total, item) => total + item.quantity * item.sellPrice, 0);

        // Apply 10% discount
        let newDiscount = 0;
        if (deliveryType === 2) {
            newDiscount = newSubTotal * 0.1;
        }

        //Total
        const newTotal = (newSubTotal - newDiscount);

        setTotal(newTotal);
        setItemCount(newCount);
        setSubTotal(newSubTotal);
        setDiscount(newDiscount);

    }, [items, deliveryType]);


    //Cancel Modal
    const [showModalCancel, setShowModalCancel] = useState(false);

    const handleNewOrder = async () => {

         const orderDetails:OrderDetail[] = items.map((item) => ({
            quantity: item.quantity,
            subtotal: item.quantity * item.sellPrice,
             itemId: item.id
        }));

        const now = new Date();
        const date = ("0" + now.getDate()).slice(-2);
        const month = ("0" + (now.getMonth() + 1)).slice(-2);
        const year = now.getFullYear();
        const hours = ("0" + now.getHours()).slice(-2);
        const minutes = ("0" + now.getMinutes()).slice(-2);
        const formattedDate = `${date}/${month}/${year} - ${hours}:${minutes}`;

        const newOrder:Order = {
            address: cli.address,
            apartment: cli.apartment,
            discount: discount,
            estimatedTime: "Falta el calculo",
            orderDate: formattedDate,
            paid: false,
            phone: cli.phone,
            total: total,
            customerId: cli.id,
            deliveryTypeId: deliveryType,
            orderStatusId: 1,
            paymentTypeId: paymentType,
            orderDetails: orderDetails,
        }
        console.log(JSON.stringify(newOrder, null, 2))
        await genericPost<Order>("orders", "¡Pedido Realizado!", newOrder);
    }

    return(
        <>
            <div className="perfil-img">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="rectangle" style={{width: '1200px'}}>
                        <h4 className="title">Detalle del Pedido</h4>
                        <Row>
                            <Col md={9}>
                                {items.map((item) => (
                                    <Card className="mb-2" key={item.id}>
                                        <Row className="no-gutters">
                                            <Col>
                                                <Card.Img
                                                    src={item.image}
                                                    style={{maxWidth: "100px" , maxHeight: "100px", minHeight: "100px", minWidth: "100px"}}
                                                    className="mt-2 my-2 mx-2"
                                                />
                                            </Col>
                                            <Col>
                                                <Card.Body>
                                                    <Card.Title>{item.name}</Card.Title>
                                                    <Card.Text style={{color: "#b92020"}}><strong>${item.sellPrice}</strong></Card.Text>
                                                </Card.Body>
                                            </Col>
                                            <Col>
                                                <Card.Body>
                                                    <p>Cantidad:</p>
                                                    <p>{item.quantity}</p>
                                                </Card.Body>
                                            </Col>
                                            <Col>
                                                <Card.Body>
                                                    <p>Subtotal:</p>
                                                    <p>${item.sellPrice * item.quantity}</p>
                                                </Card.Body>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </Col>
                            <Col className="d-flex flex-column border rounded mb-2 mx-3">
                                <div className="mt-2" >
                                    <div className="d-flex justify-content-between mt-2 mb-5">
                                        <h5>Cantidad:</h5>
                                        <h5><strong>{itemCount} Productos</strong></h5>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h5>Subtotal:</h5>
                                        <h5><strong>${subTotal}</strong></h5>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h5>Descuento:</h5>
                                        <h5><strong>${discount}</strong></h5>
                                    </div>
                                    <div className="mb-5"/>
                                    <div className="d-flex justify-content-between">
                                        <h5 style={{fontWeight: 'bold', color: '#b92020'}}>Total:</h5>
                                        <h5 style={{fontWeight: 'bold', color: '#b92020'}}>${total}</h5>
                                    </div>
                                    <div className="d-flex flex-column mt-3">
                                        <div className="mb-3">
                                            <Button className="w-100" onClick={handleNewOrder}>Confirmar Pedido</Button>
                                        </div>
                                        <div>
                                            <Button variant="secondary" className="w-100 mb-2" onClick={() => setShowModalCancel(true)}>Cancelar Pedido</Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <h4 className="title mt-2">Datos del Pedido</h4>
                        <Row className="border rounded mb-2 mx-1">
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Nombre:</p>
                                <p>{cli.name}</p>
                            </Col>
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Apellido:</p>
                                <p>{cli.lastname}</p>
                            </Col>
                        </Row>

                        {deliveryType === 1 &&(
                        <Row className="border rounded mb-2 mx-1">
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Telefono:</p>
                                <p>{cli.phone}</p>
                            </Col>
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Direccion:</p>
                                <p>{cli.address}</p>
                            </Col>
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Departamento:</p>
                                <p>{cli.apartment}</p>
                            </Col>
                        </Row>
                        )}

                        <Row className="border rounded mb-2 mx-1">
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Forma de Entrega:</p>
                                <p>{deliveryType === 1 ? "Envio a Domicilio" : "Retiro en local"}</p>
                            </Col>
                        </Row>

                        <Row className="border rounded mb-2 mx-1">
                            <Col>
                                <p style={{ fontWeight: "bold" }}>Forma de Pago:</p>
                                <p>{paymentType === 1 ? "Efectivo" : "MercadoPago"}</p>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            {showModalCancel && (
                <CancelModal
                    show={showModalCancel}
                    onHide={() => setShowModalCancel(false)}
                />
            )}
        </>
    )
}

export default NewOrderDetail;