import {useLocation, useNavigate} from "react-router-dom";
import {Customer, Order, OrderDetail} from "../../../interfaces/customer.ts";
import {useCart} from "../../../context/cart/CartContext.tsx";
import {useEffect, useState} from "react";
import './../../styles/background.css'
import './../fullCart/fullCart.css'
import {Button, Card, Col, Row} from "react-bootstrap";
import {CancelModal} from "../cancelModal/cancelModal.tsx";
import {useGenericPost} from "../../../services/useGenericPost.ts";
import {useConfetti} from "../../../services/useConfetti.ts";
import {printAndEmailDocument} from "../../../util/printComponentEmailPDF.ts"
import {useAuth0} from "@auth0/auth0-react";
const NewOrderDetail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { cli, paymentType, deliveryType }: { cli: Customer; paymentType: number; deliveryType: number } = location.state;
    const genericPost = useGenericPost();
    const confettiEffect = useConfetti();
    const {user, getAccessTokenSilently} = useAuth0();

    //Cart Context
    const {items, clearCart} = useCart();

    //Cantidad de items,total, subtotal, descuento
    const [itemCount, setItemCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [isIgnoreVisible, setIsIgnoreVisible] = useState(true);

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

        setIsIgnoreVisible(false);

        let email = "";
        if (user){
            email = user.name ?? "";
        }

        const token = await getAccessTokenSilently();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const orderDetails:OrderDetail[] = items.map((item) => ({
            id: 0,
            quantity: item.quantity,
            subtotal: item.quantity * item.sellPrice,
            itemId: item.id,
        }));

        const newOrder:Order = {
            id: 0,
            address: deliveryType === 2 ? '-' : cli.address,
            apartment: deliveryType === 2 ? '-' : cli.apartment,
            discount: discount,
            estimatedTime: "Falta el calculo",
            orderDate: new Date(),
            paid: false,
            phone: deliveryType === 2 ? '-' : cli.phone,
            total: total,
            customerId: cli.id,
            deliveryTypeId: deliveryType,
            orderStatusId: 1,
            paymentTypeId: paymentType,
            orderDetails: orderDetails,
        }

        // await printAndEmailDocument(email, token);
        await genericPost<Order>("orders", "¡Pedido Realizado!", newOrder);
        confettiEffect();
        clearCart();

        setIsIgnoreVisible(false);
    }

    return(
        <>
            <div className="perfil-img">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {items.length === 0
                        ?
                        (
                            <div className="rectangle mt-5" style={{width: '1200px', height: '600px', justifyContent: 'center', alignItems: 'center'}}>
                                <div className="text-center" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <h4>¡Gracias por tu Compra!</h4>
                                    <Button className="btn-cart-shadow" onClick={() => navigate('/historialpedido')}>Mis Pedidos</Button>
                                </div>
                            </div>
                        )
                        :
                        (
                            <div className="rectangle" style={{width: '1200px'}} id="print">
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
                                            {isIgnoreVisible && (
                                            <div className="d-flex flex-column mt-3" id="ignore">
                                                <div className="mb-3">
                                                    <Button className="w-100" onClick={handleNewOrder}>Confirmar Pedido</Button>
                                                </div>
                                                <div>
                                                    <Button variant="secondary" className="w-100 mb-2" onClick={() => setShowModalCancel(true)}>Cancelar Pedido</Button>
                                                </div>
                                            </div>
                                            )}
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
                        )
                    }
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