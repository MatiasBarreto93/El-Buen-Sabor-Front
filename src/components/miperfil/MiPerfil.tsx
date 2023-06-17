import {validationSchemaCustomer} from "../Auth0/validationSchemaCustomer.ts";
import {useFormik} from "formik";
import {Customer} from "../../interfaces/customer.ts";
import {useConfetti} from "../../services/useConfetti.ts";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useGenericPut} from "../../services/useGenericPut.ts";
import _ from 'lodash';

interface Props{
    show: boolean;
    onHide: () => void;
    cliente: Customer;
    resetForm: () => void;
}

export const MiPerfil = ({show, onHide, cliente, resetForm}:Props) => {

    const confettiEffect = useConfetti();
    const genericPut = useGenericPut();

    const handleSave = async (cli: Customer) => {
        if (!_.isEqual(cli, cliente)){
        await genericPut<Customer>("customers", cli.id, cli, "Cliente");
        confettiEffect();
        }
        onHide();
    }

//Config del Formulario Cliente
    const formik = useFormik({
        initialValues: cliente,
        validationSchema: validationSchemaCustomer,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
        onSubmit: (obj: Customer) => handleSave(obj),
    });

    return(
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header>
                <Modal.Title>Mis Datos Personales</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
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
                            <Form.Group controlId="formlastName">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    name="lastname"
                                    type="text"
                                    value={formik.values.lastname || ''}
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
                            <Form.Group controlId="formPhone">
                                <Form.Label>Telefono</Form.Label>
                                <Form.Control
                                    name="phone"
                                    type="text"
                                    value={formik.values.phone || ''}
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
                            <Form.Group controlId="formApartment">
                                <Form.Label>Departamento</Form.Label>
                                <Form.Control
                                    name="apartment"
                                    type="text"
                                    value={formik.values.apartment || ''}
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
                    <Form.Group controlId="formAdress">
                        <Form.Label>Direccion</Form.Label>
                        <Form.Control
                            name="address"
                            type="text"
                            value={formik.values.address || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.address && formik.touched.address)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.address}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Modal.Footer className="mt-4">
                        <Button variant="secondary" onClick={() => { onHide(); resetForm(); }}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={!formik.isValid}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    )
}