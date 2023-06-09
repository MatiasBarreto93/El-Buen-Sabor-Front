import {useGetUserRolesAuth0} from "../Auth0/hooks/useGetUserRolesAuth0.ts";
import {useGenericPost} from "../../services/useGenericPost.ts";
import {useGenericPut} from "../../services/useGenericPut.ts";
import {useConfetti} from "../../services/useConfetti.ts";
import {useFormik} from "formik";
import {Auth0Roles, Customer} from "../../interfaces/customer.ts";
import _ from "lodash";
import {customerDataValidationSchema} from "./customerDataValidationSchema.ts";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useAuth0, User} from "@auth0/auth0-react";
import './../mipedido/fullCart/fullCart.css'

interface Props{
    cliente: Customer;
}

export const CustomerPersonalData = ({cliente}: Props) => {

    const {user} = useAuth0();
    const confettiEffect = useConfetti();
    const genericPost = useGenericPost();
    const genericPut = useGenericPut();
    const getUserRolesAuth0 = useGetUserRolesAuth0();

    // if (!_.isEqual(cli, cliente)){

    const handleSave = async (cli: Customer) => {
        if (cli.id === 0){
            //POST BBDD
            if (user && user.sub != null){
                const userRoles:Auth0Roles[] = await getUserRolesAuth0(user.sub);
                const customerPost:Customer = await addCustomerAuth0Data(cli, user ,userRoles);
                await genericPost<Customer>("customers", "Datos Actualizados", customerPost);
                confettiEffect();
            }
        } else {
            //PUT BBDD
            if (!_.isEqual(cli, cliente)){
                await genericPut<Customer>("customers", cli.id, cli, "Datos Actualizados");
                confettiEffect();
            }
        }
    }

    async function addCustomerAuth0Data(customer: Customer,user: User, roles: Auth0Roles[]) {
        return {
            ...customer,
            user: {
                ...customer.user,
                auth0Id: user.sub ?? "",
                email: user.email ?? "",
                blocked: false,
                role: {
                    ...customer.user.role,
                    id: 5,
                    denomination: roles[0].name ?? "",
                    auth0RolId: roles[0].id ?? ""
                }
            },
        };
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

    return(
        <Form style={{ minHeight: '509px' }} onSubmit={formik.handleSubmit} className="mt-5">
            <div className="rectangle">
                <h4 className="title">Mi Perfil</h4>
            <Row>
                <Col>
                    <Form.Group controlId="formNombre" className="mb-3">
                        <Form.Label className="custom-label">Nombre</Form.Label>
                        <Form.Control
                            className="custom-input"
                            name="name"
                            type="text"
                            value={formik.values.name || ''}
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
                    <Form.Group controlId="formPhone" className="mb-3">
                        <Form.Label className="custom-label">Telefono</Form.Label>
                        <Form.Control
                            className="custom-input"
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
                    <Form.Group controlId="formApartment" className="mb-3">
                        <Form.Label className="custom-label">Departamento</Form.Label>
                        <Form.Control
                            className="custom-input"
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
            <Form.Group controlId="formAdress" className="mb-3">
                <Form.Label className="custom-label">Direccion</Form.Label>
                <Form.Control
                    className="custom-input"
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
                <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit" disabled={!formik.isValid} className="btn-cart-shadow">
                    Guardar Cambios
                </Button>
                </div>
            </div>
        </Form>
    )
}