import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import {Auth0Roles, Auth0User, Customer, Role} from "../../../../interfaces/customer.ts";
import {useGenericGet} from "../../../../services/useGenericGet.ts";
import {useGenericChangeStatus} from "../../../../services/useGenericChangeStatus.ts";
import {useCreateUserAuth0} from "../../../Auth0/hooks/useCreateUserAuth0.ts";
import {useAssignRoleToUserAuth0} from "../../../Auth0/hooks/useAssignRoleToUserAuth0.ts";
import {useGetUserRolesAuth0} from "../../../Auth0/hooks/useGetUserRolesAuth0.ts";
import {useDeleteRolesFromUserAuth0} from "../../../Auth0/hooks/useDeleteRolesFromUserAuth0.ts";
import {useChangeAuth0UserState} from "../../../Auth0/hooks/useChangeAuth0UserState.ts";
import {useGenericPost} from "../../../../services/useGenericPost.ts";
import {useGenericPut} from "../../../../services/useGenericPut.ts";
import {useFormik} from "formik";
import {ModalType} from "../../../../interfaces/ModalType.ts";
import {employeeValidationSchema} from "./employeeValidationSchema.ts";

interface Props  {
    show: boolean;
    onHide: () => void;
    title:string
    emp: Customer;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    modalType: ModalType;
}

export const EmployeeModal = ({ show, onHide, title, emp, setRefetch, modalType }: Props) =>{

    //Roles
    const [roles, setRoles] = useState<Role[]>([]);
    const [rolId, setRolId] = useState("");
    const [defaultRoleVisible, setDefaultRoleVisible] = useState(true);

    //Campos para verificar la edicion del Empleado
    const prevRoleId = useRef(emp.user.role.id);
    const prevStatus = useRef(emp.user.blocked)

    //Campos para crear un nuevo Empleado
    let [newAuth0ID] = useState("");

    //Customs Hooks Generics
    const genericPost = useGenericPost();
    const genericPut = useGenericPut();
    const updateUserStatus = useGenericChangeStatus();

    //Custom Hooks de Auth0
    const createUserAuth0 = useCreateUserAuth0();
    const assignRoleToUserAuth0 = useAssignRoleToUserAuth0()
    const getUserRolesAuth0 = useGetUserRolesAuth0();
    const deleteRolesFromUserAuth0 = useDeleteRolesFromUserAuth0();
    const updateAuth0UserStatus = useChangeAuth0UserState();

    //Obtener los roles y llenar el HTMLSelect del formulario cada vez que se renderiza el Modal
    const data = useGenericGet<Role>("roles", "Roles");
    useEffect(() =>{
        setRoles(data);
    },[data])

    //POST-PUT Empleado de AUTH0 y BBDD
    const handleSaveUpdate = async (empleado: Customer) => {
        const isNew = empleado.id === 0;
        const userId = empleado.user.auth0Id;

        //PUT
        if (!isNew && userId) {
            //AUTH0
            await handleAuth0User(isNew,empleado, userId);

            //BBDD
            await genericPut<Customer>("customers", empleado.id, empleado, "Empleado");

        //POST
        } else {
            //AUTH0
            newAuth0ID = await handleAuth0User(isNew, empleado)

            //BBDD
            const empleadoPost:Customer = await asignarAuth0Id(empleado, newAuth0ID);
            await genericPost<Customer>("customers", "Empleado", empleadoPost);
        }
        setRefetch(true);
        onHide();
    };

    //Agrega el campo auth0Id al nuevo empleado para guardarlo en la BBDD
    async function asignarAuth0Id(empleado:Customer, newAuth0ID: string) {
        return {
            ...empleado,
            user: {
                ...empleado.user,
                auth0Id: newAuth0ID,
            },
        };
    }

    //POST-PUT Empleado AUTH0
    async function handleAuth0User(newUser:boolean, empleado: Customer ,auth0Id?: string ) {
        const userId:string = auth0Id ?? "";

        //POST AUTH0
        if (newUser) {
            const empleadoUser: Auth0User = {
                email: empleado.user.email,
                password: empleado.user.password,
                blocked: empleado.user.blocked,
            };
            const newAuth0UserId = await  createUserAuth0(empleadoUser);

            const userRoles:Auth0Roles[] = await getUserRolesAuth0(newAuth0UserId);
            if (userRoles.length > 0) {
                await deleteRolesFromUserAuth0(newAuth0UserId, userRoles)
            }

            await assignRoleToUserAuth0(newAuth0UserId, rolId);
            return newAuth0UserId;

        //PUT AUTH0
        } else {

            //Si se cambia el ROL
            if (prevRoleId.current !== empleado.user.role.id){
                const userRoles:Auth0Roles[] = await getUserRolesAuth0(userId);
                if (userRoles.length > 0) {
                    await deleteRolesFromUserAuth0(userId, userRoles)
                }
                await assignRoleToUserAuth0(userId, rolId);
            }

            //Si se cambia el Estado
            if(prevStatus.current !== empleado.user.blocked){
                const isBlocked = empleado.user.blocked
                await updateAuth0UserStatus(userId, isBlocked)
            }
        }
    }

    //Maneja el estado "banned" de AUTH0 y BBDD
    const handleEstadoEmpleado = async () => {
        if (emp) {
            const id = emp.id;
            const isBlocked = !emp.user.blocked
            const authId = emp.user.auth0Id ?? "";

            //BBDD
            await updateUserStatus(id, isBlocked, "user", "Empleado");

            //AUTH0
            await updateAuth0UserStatus(authId, isBlocked);

            setRefetch(true);
            onHide();
        }
    };

    //Config del Formulario
    const formik = useFormik({
        initialValues: emp,
        validationSchema: employeeValidationSchema(emp.id),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Customer) => handleSaveUpdate(obj)
    });

    return (
        <>
             {modalType === ModalType.ChangeStatus
                ?
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Está seguro que desea modificar el estado del Empleado?<br/> <strong>{emp.name} {emp.lastname}</strong>?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleEstadoEmpleado}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
                :
                <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-xl">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
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
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            name="user.email"
                                            type="text"
                                            value={formik.values.user.email || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(formik.errors.user?.email && formik.touched.user?.email)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.user?.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
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
                            </Row>
                            <Row>
                                <Col>
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
                            {/*---------------------------------------------------------------------------------------*/}
                            {emp.id === 0 && (
                            <Row>
                                <Col>
                                    <Form.Group controlId="formPassword">
                                        <Form.Label>Contraseña Provisoria</Form.Label>
                                        <Form.Control
                                            name="user.password"
                                            type="password"
                                            value={formik.values.user.password || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(formik.errors.user?.password && formik.touched.user?.password)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.user?.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formConfirmPass">
                                        <Form.Label>Confirmar Contraseña Provisoria</Form.Label>
                                        <Form.Control
                                            name="user.confirmPassword"
                                            type="password"
                                            value={formik.values.user.confirmPassword || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(formik.errors.user?.confirmPassword && formik.touched.user?.confirmPassword)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.user?.confirmPassword}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            )}
                            {/*---------------------------------------------------------------------------------------*/}
                            <Row>
                                <Col>
                                    <Form.Group controlId="formRole">
                                        <Form.Label>Rol</Form.Label>
                                        <Form.Select
                                            name="user.role"
                                            value={JSON.stringify(formik.values.user.role)}
                                            onChange={(event) => {
                                                const selectedRole = JSON.parse(event.target.value);
                                                formik.setFieldValue("user.role", selectedRole);
                                                setRolId(selectedRole.auth0RolId);
                                            }}
                                            onClick={() => {setDefaultRoleVisible(false);}}
                                        >
                                            {defaultRoleVisible && (<option value="">-</option>)}
                                            {roles.map((role) => (
                                                <option key={role.id} value={JSON.stringify(role)}>
                                                    {role.denomination}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formBanned">
                                        <Form.Label>Estado</Form.Label>
                                        <Form.Select
                                            name="user.blocked"
                                            value={formik.values.user.blocked.toString()}
                                            onChange={(event) => {
                                                formik.setFieldValue("user.blocked", event.target.value === "true")
                                            }}
                                        >
                                            <option value="false">Activo</option>
                                            <option value="true">Bloqueado</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Modal.Footer className="mt-4">
                                <Button variant="secondary" onClick={onHide}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" type="submit" disabled={!formik.isValid}>
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}