import './../../styles/table.css'
import './fullCart.css'
import {Button, Col, Form, Row, Table, Image} from "react-bootstrap";
import {Dash, Plus, Trash3Fill} from "react-bootstrap-icons";
import {Customer} from "../../../interfaces/customer.ts";
import {useConfetti} from "../../../services/useConfetti.ts";
import {useState} from "react";
import {useFormik} from "formik";
import {customerDataValidationSchema} from "../../miperfil/customerDataValidationSchema.ts";

interface Props{
    cliente:Customer;
}

export const FullCart = ({cliente}:Props) => {

    const confettiEffect = useConfetti();

    //Botones de + y - en la tabla (deben ser estados separados por cada item)
    const [quantity, setQuantity] = useState(1);
    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
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
                <h4 className="title">Productos</h4>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <Image
                            src="https://www.cookingclassy.com/wp-content/uploads/2014/07/pepperoni-pizza3+srgb..jpg"
                            style={{ maxWidth: '65px', maxHeight: '65px', }}
                            rounded
                        />
                    </td>
                    <td>Pepperoni Pizza</td>
                    <td>$2700</td>
                    <td>
                        <Dash
                            color='#D32F2F'
                            size={24}
                            //onClick
                            onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                            onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            onClick={decreaseQuantity}
                        />
                        {quantity}
                        <Plus
                            color='#D32F2F'
                            size={24}
                            //onClick
                            onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                            onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            onClick={increaseQuantity}
                        />
                    </td>
                    <td>$2700</td>
                    <td>
                        <Trash3Fill
                            color='#D32F2F'
                            size={24}
                            //onClick
                            onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                            onMouseLeave={() => {document.body.style.cursor = 'default'}}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <Image
                            src="http://www.reylupulo.com/image/cache/catalog/imagenes/bebidas/4-228x228.png"
                            style={{ maxWidth: '65px', maxHeight: '65px', }}
                            rounded
                        />
                    </td>
                    <td>Coca 500ml</td>
                    <td>$600</td>
                    <td>
                        <Dash
                            color='#D32F2F'
                            size={24}
                            //onClick
                            onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                            onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            onClick={decreaseQuantity}
                        />
                        {quantity}
                        <Plus
                            color='#D32F2F'
                            size={24}
                            onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                            onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            onClick={increaseQuantity}
                        />
                    </td>
                    <td>$1800</td>
                    <td>
                        <Trash3Fill
                            color='#D32F2F'
                            size={24}
                            onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                            onMouseLeave={() => {document.body.style.cursor = 'default'}}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <Image
                            src="https://tastesbetterfromscratch.com/wp-content/uploads/2020/06/Hamburger-recipe-7.jpg"
                            style={{ maxWidth: '65px', maxHeight: '65px', }}
                            rounded
                        />
                    </td>
                    <td>Burger Clasica</td>
                    <td>$2500</td>
                    <td>
                        <Dash
                            color='#D32F2F'
                            size={24}
                            onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                            onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            onClick={decreaseQuantity}
                        />
                        {quantity}
                        <Plus
                            color='#D32F2F'
                            size={24}
                            onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                            onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            onClick={increaseQuantity}
                        />
                    </td>
                    <td>$5000</td>
                    <td>
                        <Trash3Fill
                            color='#D32F2F'
                            size={24}
                            //onClick
                            onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                            onMouseLeave={() => {document.body.style.cursor = 'default'}}
                        />
                    </td>
                </tr>
                </tbody>
                <tfoot>

                </tfoot>
            </Table>
            </div>
            <div className="rectangle">
                <h4 className="title">Datos Personales</h4>
                <Row>
                    <Col>
                        <Form.Group controlId="formNombre" className="mb-3">
                            <Form.Label className="custom-label">Nombre</Form.Label>
                            <Form.Control
                                className="custom-input"
                                name="name"
                                type="text"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={Boolean(formik.errors.name && formik.touched.name)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formlastName" className="mb-3">
                            <Form.Label className="custom-label">Apellido</Form.Label>
                            <Form.Control
                                className="custom-input"
                                name="lastname"
                                type="text"
                                value={formik.values.lastname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={Boolean(formik.errors.lastname && formik.touched.lastname)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.lastname}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="formPhone" className="mb-3">
                            <Form.Label className="custom-label">Telefono</Form.Label>
                            <Form.Control
                                className="custom-input"
                                name="phone"
                                type="text"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={Boolean(formik.errors.phone && formik.touched.phone)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formApartment" className="mb-3">
                            <Form.Label className="custom-label">Departamento</Form.Label>
                            <Form.Control
                                className="custom-input"
                                name="apartment"
                                type="text"
                                value={formik.values.apartment}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={Boolean(formik.errors.apartment && formik.touched.apartment)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.apartment}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="formAdress" className="mb-3">
                    <Form.Label className="custom-label">Direccion de Entrega</Form.Label>
                    <Form.Control
                        className="custom-input"
                        name="address"
                        type="text"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={Boolean(formik.errors.address && formik.touched.address)}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.address}
                    </Form.Control.Feedback>
                </Form.Group>
            </div>
            <div className="rectangle">
                <h4 className="title">Forma de Entrega</h4>
                <Form.Check
                    type="radio"
                    name="tipo-entrega"
                    id="custom-radio-1"
                    className="custom-radio"
                    label="Retiro en Local"
                />
                <Form.Check
                    type="radio"
                    name="tipo-entrega"
                    id="custom-radio-2"
                    className="custom-radio"
                    label="Envio a Domicilio"
                />
            </div>
            <div className="rectangle">
                <h4 className="title">Forma de Pago</h4>
                <Form.Check
                    type="radio"
                    name="tipo-pago"
                    id="custom-radio-3"
                    className="custom-radio"
                    label="Efectivo"
                />
                <Form.Check
                    type="radio"
                    name="tipo-pago"
                    id="custom-radio-4"
                    className="custom-radio"
                    label="MercadoPago"
                />
            </div>
            <div className="rectangle-btn">
                <Button variant="secondary" className="btn-cart-shadow">
                    Cancelar Pedido
                </Button>
                <Button variant="primary" type="submit" disabled={!formik.isValid} className="btn-cart-shadow">
                    Confirmar Pedido!
                </Button>
            </div>
        </Form>
    )
}