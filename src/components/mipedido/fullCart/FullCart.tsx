import './../../styles/table.css'
import './fullCart.css'
import "./../../styles/toggle-buttons.css"
import {Button, Col, Form, Row, FloatingLabel, Card} from "react-bootstrap";
import {Customer} from "../../../interfaces/customer.ts";
import {useConfetti} from "../../../services/useConfetti.ts";
import {useState} from "react";
import {useFormik} from "formik";
import {customerDataValidationSchema} from "../../miperfil/customerDataValidationSchema.ts";
import {DeleteButton} from "../../table/DeleteButton.tsx";
import {QuantityButton} from "../../table/QuantityButton.tsx";
import {useCart} from "../../../context/cart/CartContext.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

interface Props{
    cliente:Customer;
}

export const FullCart = ({cliente}:Props) => {

    const navigate = useNavigate();
    const {isAuthenticated} = useAuth0()
    const {loginWithRedirect} = useAuth0()
    const confettiEffect = useConfetti();

    //Cart Context
    const {items, removeFromCart, updateQuantity} = useCart();

    //Cantidad de items y precio total
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const total = items.reduce((total, item) => total + item.quantity * item.sellPrice, 0);

    //Delivery
    const [deliveryType, setDeliveryType] = useState(1);
    const handleToggleDeliveryType = (selectedValue: number) => {
        setDeliveryType(selectedValue);
    };

    //Payment
    const [paymentType, setPaymentType] = useState(1);
    const handleTogglePaymentType = (selectedValue: number) => {
        setPaymentType(selectedValue);
    };

    const handleSave = async (cli: Customer) => {
        //------
        console.log(cli)
        //------
        confettiEffect();
    }

    //Datos del cliente
    const formik = useFormik({
        initialValues: cliente,
        validationSchema: customerDataValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
        onSubmit: (obj: Customer) => handleSave(obj),
    });

    return(
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Form style={{ minHeight: '509px', width: "1200px" }} onSubmit={formik.handleSubmit}>
                <div className="rectangle">
                    <h4 className="title">Mi Pedido</h4>
                    <Row>
                        <Col md={8}>
                            {items.map((item) => (
                            <Card className="mb-2" key={item.id}>
                                <Row className="no-gutters">
                                    <Col>
                                        <Card.Img
                                            src={`data:image/jpeg;base64,${item.image}`}
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
                                    <Col className="d-flex align-items-center justify-content-center mb-3">
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.8em',
                                            color: 'grey'
                                        }}>
                                            <QuantityButton
                                                increment={() => {
                                                    if (item.quantity < item.currentStock) {
                                                        updateQuantity(item.id, item.quantity + 1)
                                                    }
                                                }}
                                                decrement={() => {
                                                    if (item.quantity > 1) {
                                                        updateQuantity(item.id, item.quantity - 1)
                                                    }
                                                }}
                                                count={item.quantity}
                                            />
                                            <div>
                                                Disponibles: {item.currentStock}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="d-flex align-items-center justify-content-center mb-3">
                                        <DeleteButton onClick={() => removeFromCart(item.id)}/>
                                    </Col>
                                </Row>
                            </Card>

                            ))}
                        </Col>
                        <Col className="border rounded d-flex flex-column align-items-center justify-content-center">
                            <div className="m-3">
                                <h5>{itemCount} Productos - ${total.toFixed(2)}</h5>
                            </div>
                            <div className="text-center mb-3">
                                {!isAuthenticated && (
                                    <Button variant={"primary"} className="mb-3 w-100" onClick={() => loginWithRedirect()}>Confirmar Pedido</Button>
                                )}
                                <Button variant={"outline-primary"} className="mb-3 w-100" onClick={() => navigate('/')}>Continuar Comprando</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                {isAuthenticated && (
                <div className="rectangle">
                    <h4 className="title">Datos Personales</h4>
                    <Row>
                        <Col>
                            <Form.Group controlId="formNombre" className="mb-3">
                                <FloatingLabel controlId="floatingInput" label={"Nombre:"} className="mt-3 custom-label">
                                    <Form.Control
                                        className="custom-input"
                                        name="name"
                                        type="text"
                                        placeholder="Nombre"
                                        value={formik.values.name || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={Boolean(formik.errors.name && formik.touched.name)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.name}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formlastName" className="mb-3">
                                <FloatingLabel controlId="floatingInput" label={"Apellido:"} className="mt-3 custom-label">
                                    <Form.Control
                                        className="custom-input"
                                        name="lastname"
                                        type="text"
                                        placeholder="Apellido"
                                        value={formik.values.lastname || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={Boolean(formik.errors.lastname && formik.touched.lastname)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.lastname}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formPhone" className="mb-3">
                                <FloatingLabel controlId="floatingInput" label={"Telefono:"} className="mt-3 custom-label">
                                    <Form.Control
                                        className="custom-input"
                                        name="phone"
                                        type="text"
                                        placeholder="Telefono"
                                        value={formik.values.phone || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={Boolean(formik.errors.phone && formik.touched.phone)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.phone}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formApartment" className="mb-3">
                                <FloatingLabel controlId="floatingInput" label={"Departamento:"} className="mt-3 custom-label">
                                    <Form.Control
                                        className="custom-input"
                                        name="apartment"
                                        type="text"
                                        placeholder="Departamento"
                                        value={formik.values.apartment || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={Boolean(formik.errors.apartment && formik.touched.apartment)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.apartment}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="formAdress" className="mb-3">
                        <FloatingLabel controlId="floatingInput" label={"Direccion:"} className="mt-3 custom-label">
                            <Form.Control
                                className="custom-input"
                                name="address"
                                type="text"
                                placeholder="Direccion"
                                value={formik.values.address || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={Boolean(formik.errors.address && formik.touched.address)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.address}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>
                    <h4 className="title mt-5">Forma de Entrega</h4>
                    <div className="d-flex justify-content-center">
                        <div className="radio-container">
                            <Form.Check
                                className="custom-radio"
                                type="radio"
                                id="deliveryType1"
                                name="deliveryType"
                                label="Envio a Domicilio"
                                value={1}
                                checked={deliveryType === 1}
                                onChange={() => handleToggleDeliveryType(1)}
                            />
                            <Form.Check
                                className="custom-radio"
                                type="radio"
                                id="deliveryType2"
                                name="deliveryType"
                                label="Retiro en Local"
                                value={2}
                                checked={deliveryType === 2}
                                onChange={() => handleToggleDeliveryType(2)}
                            />
                        </div>
                    </div>
                    <h4 className="title mt-5">Forma de Pago</h4>
                    <div className="d-flex justify-content-center">
                        <div className="radio-container">
                            <Form.Check
                                className="custom-radio"
                                type="radio"
                                id="paymentType1"
                                name="paymentType"
                                label="Efectivo"
                                value={1}
                                checked={paymentType === 1}
                                onChange={() => handleTogglePaymentType(1)}
                            />
                            <Form.Check
                                className="custom-radio"
                                type="radio"
                                id="paymentType2"
                                name="paymentType"
                                label="MercadoPago"
                                value={2}
                                checked={paymentType === 2}
                                onChange={() => handleTogglePaymentType(2)}
                            />
                        </div>
                    </div>
                    <div className="mt-5 text-center">
                        <Button variant="secondary" className="btn-cart-shadow">
                            Cancelar Pedido
                        </Button>
                        <Button variant="primary" type="submit" disabled={!formik.isValid} className="btn-cart-shadow">
                            ¡Confirmar Pedido!
                        </Button>
                    </div>
                </div>

                )}
            </Form>
        </div>
    )
}