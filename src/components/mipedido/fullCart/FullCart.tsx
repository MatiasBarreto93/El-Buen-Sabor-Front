import './../../styles/table.css'
import './fullCart.css'
import "./../../styles/toggle-buttons.css"
import {Button, Col, Form, Row, FloatingLabel, Card, ToggleButtonGroup, ToggleButton} from "react-bootstrap";
import {Customer} from "../../../interfaces/customer.ts";
import {useConfetti} from "../../../services/useConfetti.ts";
import {useState} from "react";
import {useFormik} from "formik";
import {customerDataValidationSchema} from "../../miperfil/customerDataValidationSchema.ts";
import {DeleteButton} from "../../table/DeleteButton.tsx";
import {QuantityButton} from "../../table/QuantityButton.tsx";

interface Props{
    cliente:Customer;
}

export const FullCart = ({cliente}:Props) => {

    const confettiEffect = useConfetti();

    const [count, setCount] = useState(0);
    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    const removeItem = () => {
        // Logic to remove item from the cart
    };


    //TOGGLE BUTTONS
    //Delivery
    const [deliveryType, setDeliveryType] = useState(1);
    const handleToggleDeliveryType = (selectedValue: number) => {
        setDeliveryType(selectedValue);
    };


    //TOGGLE BUTTONS
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

    const formik = useFormik({
        initialValues: cliente,
        validationSchema: customerDataValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
        onSubmit: (obj: Customer) => handleSave(obj),
    });

    return(
        <Form style={{ minHeight: '800px' }} onSubmit={formik.handleSubmit}>
            <div className="rectangle">
                <h4 className="title">Mi Pedido</h4>
                <Row>
                    <Col md={10}>
                        <Card className="mb-2">
                            <Row className="no-gutters">
                                <Col>
                                    <Card.Img
                                        src="https://www.cookingclassy.com/wp-content/uploads/2014/07/pepperoni-pizza3+srgb..jpg"
                                        style={{maxWidth: "100px" , maxHeight: "100px", minHeight: "100px", minWidth: "100px"}}
                                        className="mt-2 my-2 mx-2"
                                    />
                                </Col>
                                <Col>
                                    <Card.Body>
                                        <Card.Title>Nombre Producto</Card.Title>
                                        <Card.Text>$800</Card.Text>
                                    </Card.Body>
                                </Col>
                                <Col className="d-flex align-items-center justify-content-center mb-3">
                                    <QuantityButton increment={increment} decrement={decrement} count={count}/>
                                </Col>
                                <Col className="d-flex align-items-center justify-content-center mb-3">
                                    <DeleteButton onClick={removeItem}/>
                                </Col>
                            </Row>
                        </Card>
                        <Card className="mb-2">
                            <Row className="no-gutters">
                                <Col>
                                    <Card.Img
                                        src="https://www.cookingclassy.com/wp-content/uploads/2014/07/pepperoni-pizza3+srgb..jpg"
                                        style={{maxWidth: "100px" , maxHeight: "100px", minHeight: "100px", minWidth: "100px"}}
                                        className="mt-2 my-2 mx-2"
                                    />
                                </Col>
                                <Col>
                                    <Card.Body>
                                        <Card.Title>Nombre Producto</Card.Title>
                                        <Card.Text>$800</Card.Text>
                                    </Card.Body>
                                </Col>
                                <Col className="d-flex align-items-center justify-content-center mb-3">
                                    <QuantityButton increment={increment} decrement={decrement} count={count}/>
                                </Col>
                                <Col className="d-flex align-items-center justify-content-center mb-3">
                                    <DeleteButton onClick={removeItem}/>
                                </Col>
                            </Row>
                        </Card>
                        <Card className="mb-2">
                            <Row className="no-gutters">
                                <Col>
                                    <Card.Img
                                        src="https://www.cookingclassy.com/wp-content/uploads/2014/07/pepperoni-pizza3+srgb..jpg"
                                        style={{maxWidth: "100px" , maxHeight: "100px", minHeight: "100px", minWidth: "100px"}}
                                        className="mt-2 my-2 mx-2"
                                    />
                                </Col>
                                <Col>
                                    <Card.Body>
                                        <Card.Title>Nombre Producto</Card.Title>
                                        <Card.Text>$800</Card.Text>
                                    </Card.Body>
                                </Col>
                                <Col className="d-flex align-items-center justify-content-center mb-3">
                                    <QuantityButton increment={increment} decrement={decrement} count={count}/>
                                </Col>
                                <Col className="d-flex align-items-center justify-content-center mb-3">
                                    <DeleteButton onClick={removeItem}/>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col className="border rounded d-flex flex-column align-items-center justify-content-center">
                        <div className="m-3">
                            <h5>12 Articulos - $8000</h5>
                        </div>
                        <div className="text-center">
                            <Button variant={"primary"} className="mb-3 mx-3">Confirmar Pedido</Button>
                            <Button variant={"outline-primary"} className="mb-3 mx-3">Continuar Comprando</Button>
                        </div>
                    </Col>
                </Row>
            </div>
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
                <ToggleButtonGroup type="radio" name={"options"} defaultValue={1} onChange={handleToggleDeliveryType}>
                    <ToggleButton id="tbg-radio-1" value={1} className={`toggle-button ${deliveryType === 1 ? 'active' : ''}`}>
                        Envio a Domicilio
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value={2} className={`toggle-button ${deliveryType === 2 ? 'active' : ''}`}>
                        Retiro en Local
                    </ToggleButton>
                </ToggleButtonGroup>
                <h4 className="title mt-5">Forma de Pago</h4>
                <ToggleButtonGroup type="radio" name={"options"} defaultValue={1} onChange={handleTogglePaymentType}>
                    <ToggleButton id="tbg-radio-3" value={1} className={`toggle-button ${paymentType === 1 ? 'active' : ''}`}>
                        Efectivo
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-4" value={2} className={`toggle-button ${paymentType === 2 ? 'active' : ''}`}>
                        MercadoPago
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className="mt-5 text-center">
                <Button variant="secondary" className="btn-cart-shadow">
                    Cancelar Pedido
                </Button>
                <Button variant="primary" type="submit" disabled={!formik.isValid} className="btn-cart-shadow">
                    ¡Confirmar Pedido!
                </Button>
                </div>
            </div>
        </Form>
    )
}