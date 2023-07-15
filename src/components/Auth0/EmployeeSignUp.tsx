import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useFormik} from "formik";
import {useGetAuth0LoginCount} from "./hooks/useGetAuth0LoginCount.ts";
import {useChangeUserPasswordAuth0} from "./hooks/useChangeUserPasswordAuth0.tsx";
import {useGetUserRolesAuth0} from "./hooks/useGetUserRolesAuth0.ts";
import {ModalType} from "../../interfaces/ModalType.ts";
import {Auth0Password, Auth0Roles} from "../../interfaces/customer.ts";
import {Button, Form, Modal} from "react-bootstrap";
import {validationSchemaPass} from "./validationSchemaPass.ts";

interface Props {
    firstRender: boolean;
    setFirstRender: (value: boolean) => void;
}

export const EmployeeSignUp = ({firstRender, setFirstRender}:Props) => {

    //Hooks
    const { user} = useAuth0();

    //Custom Hooks de Auth0
    const getAuth0LoginCount = useGetAuth0LoginCount();
    const getUserRolesAuth0 = useGetUserRolesAuth0();
    const changeUserPasswordAuth0 = useChangeUserPasswordAuth0()

    //Manejo del modal
    const [showModal, setShowModal] = useState(false);
    const [currentModal, setCurrentModal] = useState<ModalType>(ModalType.None);

    //Password para el Nuevo Empleado
    const [auth0Password] = useState<Auth0Password>({
        password: '',
        confirmPassword: ''
    });

    useEffect(() =>{
        async function getLoginCount(){
            if (user && user.sub != null && firstRender){
                const logins:number = await getAuth0LoginCount(user.sub)
                if (logins === 1){
                    const userRoles: Auth0Roles[] = await getUserRolesAuth0(user.sub);
                    if (userRoles.at(0)?.name !== "Cliente"){
                        setCurrentModal(ModalType.ChangePass)
                        setShowModal(true)
                    }
                } else{
                    setFirstRender(false);
                    localStorage.setItem('firstRender', JSON.stringify(false));
                }
            }
        }
        getLoginCount();
    },[user, firstRender])


    const handleNewPass = async (newPass: Auth0Password) => {
        if (user && user.sub != null){
            await changeUserPasswordAuth0(user.sub, newPass.password)
            setFirstRender(false)
            localStorage.setItem('firstRender', JSON.stringify(false));
            setShowModal(false)
        }
    }

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
            {currentModal === ModalType.ChangePass
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
                ) : null}
        </>
    )
}