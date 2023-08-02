import {useGenericPut} from "../../services/useGenericPut.ts";
import {useConfetti} from "../../services/useConfetti.ts";
import {useFormik} from "formik";
import {Auth0Password, Customer} from "../../interfaces/customer.ts";
import _ from "lodash";
import {customerDataValidationSchema} from "./customerDataValidationSchema.ts";
import {Button, Col, FloatingLabel, Form, Row} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";
import './../mipedido/fullCart/fullCart.css'
import {validationSchemaPass} from "../Auth0/validationSchemaPass.ts";
import {useEffect, useState} from "react";
import {useChangeUserPasswordAuth0} from "../Auth0/hooks/useChangeUserPasswordAuth0.tsx";
import {toast} from "react-toastify";
import {useGetCustomer} from "../../services/useGetCustomer.ts";
import {useInitializeCustomer} from "../trabajo/menus/employees/hooks/useInitializeCustomer.ts";
import secureLS from "../../util/secureLS.ts";

export const CustomerPersonalData = () => {

    const getCustomer = useGetCustomer();
    const confettiEffect = useConfetti();
    const genericPut = useGenericPut();
    const {user} = useAuth0();
    const changeUserPasswordAuth0 = useChangeUserPasswordAuth0()
    const [cliente, setCliente ] = useInitializeCustomer(undefined);
    const [auth0Password] = useState<Auth0Password>({
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user?.sub) {
            getCustomer(user.sub)
                .then((customer) => {
                    setCliente(customer);
                })
                .catch((error) => {
                    console.error("Error fetching customer data:", error);
                });
        }
    }, [user?.sub]);

    const handleSave = async (cli: Customer) => {
        if (!_.isEqual(cli, cliente)){
            await genericPut<Customer>("customers", cli.id, cli, "Datos Actualizados");
            confettiEffect();
            if (user?.sub) {
                secureLS.remove(user.sub);
                getCustomer(user.sub)
                    .then((customer) => {
                        setCliente(customer);
                    })
                    .catch((error) => {
                        console.error("Error fetching customer data:", error);
                    });
            }
        }
    }

    const handleNewPass = async (newPass: Auth0Password) => {
        if (user?.sub){
            await changeUserPasswordAuth0(user.sub, newPass.password)
            toast.success(`Contraseña Actualizada`, {
                position: "top-center",
            });

            confettiEffect();
        }
    }
    //Config del Formulario Cliente
    const formik = useFormik({
        initialValues: cliente,
        validationSchema: customerDataValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
        onSubmit: (obj: Customer) => handleSave(obj),
    });


    //Formik Password
    const formikPassword = useFormik({
        initialValues: auth0Password,
        validationSchema: validationSchemaPass,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (obj: Auth0Password) => {
            await handleNewPass(obj);
            formikPassword.resetForm();
        },
    });

    return(
        <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Form style={{ minHeight: '509px', width: "1200px" }} onSubmit={formik.handleSubmit} className="mt-5 mb-5">
            <div className="rectangle" style={{maxWidth: "1200px"}}>
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
                <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit" disabled={!formik.isValid} className="btn-cart-shadow">
                    Guardar Cambios
                </Button>
                </div>
            </div>
        </Form>
        </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="rectangle" style={{width: '1180px' ,maxWidth: "1200px"}}>
                    <h4 className="title">Cambiar Contraseña</h4>
                    <Form onSubmit={formikPassword.handleSubmit}>
                        <Row>
                            <Col>
                                <Form.Group controlId="formPassword">
                                    <FloatingLabel controlId="floatingInput" label={"Contraseña:"} className="mt-3 custom-label">
                                    <Form.Control
                                        className="custom-input"
                                        name="password"
                                        type="password"
                                        placeholder="Contraseña:"
                                        value={formikPassword.values.password || ''}
                                        onChange={formikPassword.handleChange}
                                        onBlur={formikPassword.handleBlur}
                                        isInvalid={Boolean(formikPassword.errors.password && formikPassword.touched.password)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formikPassword.errors.password}
                                    </Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formConfirmPassowrd">
                                    <FloatingLabel controlId="floatingInput" label={"Confirmar Contraseña:"} className="mt-3 custom-label">
                                    <Form.Control
                                        className="custom-input"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirmar Contraseña:"
                                        value={formikPassword.values.confirmPassword || ''}
                                        onChange={formikPassword.handleChange}
                                        onBlur={formikPassword.handleBlur}
                                        isInvalid={Boolean(formikPassword.errors.confirmPassword && formikPassword.touched.confirmPassword)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formikPassword.errors.confirmPassword}
                                    </Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-center">
                        <Button variant="primary" type="submit" className="mt-5" disabled={!formikPassword.isValid}>
                            Guardar Cambios
                        </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}