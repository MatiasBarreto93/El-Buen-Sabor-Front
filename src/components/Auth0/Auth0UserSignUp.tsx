import {useAuth0} from "@auth0/auth0-react";
import {useGetAuth0LoginCount} from "./hooks/useGetAuth0LoginCount.ts";
import {useEffect, useState} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useInitializeCustomer} from "../trabajo/menus/employees/hooks/useInitializeCustomer.ts";
import {useGetUserRolesAuth0} from "./hooks/useGetUserRolesAuth0.ts";
import {ModalType} from "../../interfaces/ModalType.ts";
import {useFormik} from "formik";
import {Auth0Password, Auth0Roles, Customer} from "../../interfaces/customer.ts";
import {useGenericPost} from "../../services/useGenericPost.ts";
import {useChangeUserPasswordAuth0} from "./hooks/useChangeUserPasswordAuth0.tsx";
import {useConfetti} from "../../services/useConfetti.ts";
import {validationSchemaPass} from "./validationSchemaPass.ts";
import {singUpCustomerValidationSchema} from "./singUpCustomerValidationSchema.ts";

interface Props {
    firstRender: boolean;
    setFirstRender: (value: boolean) => void;
}

export const Auth0UserSignUp = ({firstRender, setFirstRender}:Props) => {

    //Hooks
    const { user} = useAuth0();

    //Custom Hooks de Auth0
    const getAuth0LoginCount = useGetAuth0LoginCount();
    const getUserRolesAuth0 = useGetUserRolesAuth0();
    const changeUserPasswordAuth0 = useChangeUserPasswordAuth0()

    //Custom Generic Hooks
    const genericPost = useGenericPost();
    const confettiEffect = useConfetti();

    //Manejo del modal
    const [showModal, setShowModal] = useState(false);
    const [currentModal, setCurrentModal] = useState<ModalType>(ModalType.None);

    //Se inicializa el Cliente
    const [cliente, setCliente, createNewEmployee] = useInitializeCustomer(undefined);

    //Rol
    const [rol, setRol] = useState<Auth0Roles>({} as Auth0Roles)

    //Password para el Nuevo Empleado
    const [auth0Password] = useState<Auth0Password>({
        password: '',
        confirmPassword: ''
    });

    useEffect(() =>{
        async function getLoginCount(){
            if (user && user.sub != null && firstRender){
                const logins = await getAuth0LoginCount(user.sub)
                if (logins === 1){
                    const userRoles: Auth0Roles[] = await getUserRolesAuth0(user.sub);
                    setRol(userRoles[0])
                    if (userRoles.at(0)?.name !== "Cliente"){
                        setCurrentModal(ModalType.ChangePass)
                        setShowModal(true)
                    } else {
                        setCurrentModal(ModalType.SingUp)
                        setCliente(createNewEmployee())
                        setShowModal(true)
                    }
                }
            }
        }
        getLoginCount();
    },[user, firstRender])


    //Agregar los datos de auth0 y rol al cliente para guardar en la BBDD
    async function asignarAuth0IdAndRol(empleado: Customer, newAuth0ID: string, email: string) {
        return {
            ...empleado,
            user: {
                ...empleado.user,
                auth0Id: newAuth0ID,
                email: email,
                blocked: false,
                role: {
                    ...empleado.user.role,
                    id: 5,
                    denomination: rol.name,
                    auth0RolId: rol.id,
                },
            },
        };
    }

    //POST en BBDD de Cliente
    const handleSave= async (cliente: Customer) => {
        if (user && user.sub != null && user.email != null){
            const newClient:Customer = await asignarAuth0IdAndRol(cliente, user?.sub, user.email);
            await genericPost<Customer>("customers", "Cliente", newClient);
            setFirstRender(false)
            localStorage.setItem('firstRender', JSON.stringify(false));
            setShowModal(false)
            confettiEffect();
        }
    }

    const handleNewPass = async (newPass: Auth0Password) => {
        if (user && user.sub != null){
            await changeUserPasswordAuth0(user.sub, newPass.password)
            setFirstRender(false)
            localStorage.setItem('firstRender', JSON.stringify(false));
            setShowModal(false)
        }
    }

    //Config del Formulario Cliente
    const formik = useFormik({
        initialValues: cliente,
        validationSchema: singUpCustomerValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Customer) => handleSave(obj),
    });

    //Config Formulario cambio de contrasenia
    const formikPassword = useFormik({
        initialValues: auth0Password,
        validationSchema: validationSchemaPass,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Auth0Password) => handleNewPass(obj),
    });

    return(
        <>
            {
                currentModal === ModalType.SingUp
                    ?
                    (
                        <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                            <Modal.Header>
                                <Modal.Title>Gracias por Registrarte!!! :D</Modal.Title>
                            </Modal.Header>
                                <Modal.Body> Para continuar y poder realizar un pedido ingresa tus datos personales</Modal.Body>
                            <Modal.Body>
                                <Form onSubmit={formik.handleSubmit}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="formNombre">
                                                <Form.Label>Nombre</Form.Label>
                                                <Form.Control
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
                                        <Button variant="primary" type="submit" disabled={!formik.isValid}>
                                            Guardar
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    )
                    : currentModal === ModalType.ChangePass
                        ?
                        (
                            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                                <Modal.Header>
                                    <Modal.Title>Cambiar la Contraseña</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form onSubmit={formikPassword.handleSubmit}>
                                        <Form.Group controlId="formPassword">
                                            <Form.Label>Contraseña:</Form.Label>
                                            <Form.Control
                                                name="password"
                                                type="password"
                                                value={formikPassword.values.password || ''}
                                                onChange={formikPassword.handleChange}
                                                onBlur={formikPassword.handleBlur}
                                                isInvalid={Boolean(formikPassword.errors.password && formikPassword.touched.password)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formikPassword.errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="formConfirmPassowrd">
                                            <Form.Label>Confirmar Contraseña:</Form.Label>
                                            <Form.Control
                                                name="confirmPassword"
                                                type="password"
                                                value={formikPassword.values.confirmPassword || ''}
                                                onChange={formikPassword.handleChange}
                                                onBlur={formikPassword.handleBlur}
                                                isInvalid={Boolean(formikPassword.errors.confirmPassword && formikPassword.touched.confirmPassword)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formikPassword.errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Modal.Footer className="mt-4">
                                            <Button variant="primary" type="submit" disabled={!formikPassword.isValid}>
                                                Guardar
                                            </Button>
                                        </Modal.Footer>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                        )
                        :
                        null
            }
        </>
    )
}