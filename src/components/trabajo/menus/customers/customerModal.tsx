import {Auth0User, Customer, Role} from "../../../../interfaces/customer.ts";
import {ModalType} from "../../../../interfaces/ModalType.ts";
import React, {useEffect, useRef, useState} from "react";
import {useGenericPost} from "../../../../services/useGenericPost.ts";
import {useGenericPut} from "../../../../services/useGenericPut.ts";
import {useGenericChangeStatus} from "../../../../services/useGenericChangeStatus.ts";
import {useCreateUserAuth0} from "../../../Auth0/hooks/useCreateUserAuth0.ts";
import {useAssignRoleToUserAuth0} from "../../../Auth0/hooks/useAssignRoleToUserAuth0.ts";
import {useChangeAuth0UserState} from "../../../Auth0/hooks/useChangeAuth0UserState.ts";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useFormik} from "formik";
import {useGenericGet} from "../../../../services/useGenericGet.ts";
import {customerValidationSchema} from "./customerValidationSchema.ts";

interface Props  {
    show: boolean;
    onHide: () => void;
    title:string
    cus: Customer;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    modalType: ModalType;
}
export const CustomerModal = ({ show, onHide, title, cus, setRefetch, modalType }: Props) => {

    //Campos para crear un nuevo cliente
    let [newAuth0ID] = useState("");

    //Campos para verificar la edicion del cliente
    const prevStatus = useRef(cus.user.blocked)

    //Roles
    const [roles, setRoles] = useState<Role[]>([]);
    //Seteo el rol a "Cliente"
    const defaultRole:Role | undefined = roles.find((role) => role.id === 5);

    //Obtener los roles y llenar el HTMLSelect del formulario cada vez que se renderiza el Modal
    const data = useGenericGet<Role>("roles", "Roles");
    useEffect(() =>{
        setRoles(data);
    },[data])

    //Customs Hooks Generics
    const genericPost = useGenericPost();
    const genericPut = useGenericPut();
    const updateUserStatus = useGenericChangeStatus();

    //Custom Hooks de Auth0
    const createUserAuth0 = useCreateUserAuth0();
    const assignRoleToUserAuth0 = useAssignRoleToUserAuth0()
    const updateAuth0UserStatus = useChangeAuth0UserState();

    //POST-PUT CLiente de AUTH0 y BBDD
    const handleSaveUpdate = async (customer: Customer) => {
        const isNew = customer.id === 0;
        const userId = customer.user.auth0Id;

        //PUT
        if (!isNew && userId) {
            //AUTH0
            await handleAuth0User(isNew,customer, userId);

            //BBDD
            await genericPut<Customer>("customers", customer.id, customer, "Cliente Editado");

            //POST
        } else {
            //AUTH0
            newAuth0ID = await handleAuth0User(isNew, customer)

            //BBDD
            const clientePost:Customer = await asignarAuth0IdRoleInfo(customer, newAuth0ID);
            await genericPost<Customer>("customers", "Cliente Creado", clientePost);
        }
        setRefetch(true);
        onHide();
    };

    //Agrega el campo auth0Id al nuevo cliente para guardarlo en la BBDD
    async function asignarAuth0IdRoleInfo(customer:Customer, newAuth0ID: string) {
        return {
            ...customer,
            user: {
                ...customer.user,
                auth0Id: newAuth0ID,
                role: defaultRole || {
                    id: 0,
                    denomination: "",
                    auth0RolId: ""
                },
            },
        };
    }

    //POST-PUT Cliente AUTH0
    async function handleAuth0User(newUser:boolean, customer: Customer ,auth0Id?: string ) {
        const userId:string = auth0Id ?? "";

        //POST AUTH0
        if (newUser) {
            const customerUser: Auth0User = {
                email: customer.user.email,
                password: customer.user.password,
                blocked: customer.user.blocked,
            };
            const newAuth0UserId = await  createUserAuth0(customerUser);
            if (defaultRole){
            await assignRoleToUserAuth0(newAuth0UserId, defaultRole.auth0RolId);
            }
            return newAuth0UserId;

            //PUT AUTH0
        } else {
            //Si se cambia el Estado
            if(prevStatus.current !== customer.user.blocked){
                const isBlocked = customer.user.blocked
                await updateAuth0UserStatus(userId, isBlocked)
            }
        }
    }

    //Maneja el estado "banned" de AUTH0 y BBDD
    const handleEstadoCliente = async () => {
        if (cus) {
            const id = cus.id;
            const isBlocked = !cus.user.blocked
            const authId = cus.user.auth0Id ?? "";

            //BBDD
            await updateUserStatus(id, isBlocked, "user", "Cliente");

            //AUTH0
            await updateAuth0UserStatus(authId, isBlocked);

            setRefetch(true);
            onHide();
        }
    };

    //Config del Formulario
    const formik = useFormik({
        initialValues: cus,
        validationSchema: customerValidationSchema(cus.id),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Customer) => handleSaveUpdate(obj)
    });

    return(
        <>
            {modalType === ModalType.ChangeStatus
                ?
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Está seguro que desea modificar el estado del Cliente?<br/> <strong>{cus.name} {cus.lastname}</strong>?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleEstadoCliente}>
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
                            {cus.id === 0 && (
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
                                            disabled={true}
                                            name="user.role"
                                            value={JSON.stringify(formik.values.user.role)}
                                            defaultValue={JSON.stringify(defaultRole)}
                                        >
                                            <option key={defaultRole?.id} value={JSON.stringify(defaultRole)}>
                                                {defaultRole?.denomination}
                                            </option>
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