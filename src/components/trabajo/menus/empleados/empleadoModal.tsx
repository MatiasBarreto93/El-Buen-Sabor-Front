import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import { Auth0User, Customer, Role, User} from "../../../../types/customer.ts";
import {useAuth0} from "@auth0/auth0-react";
import {
    assignRoleToUser,
    deleteRolesFromUser,
    fetchRoles,
    getUserRoles,
    newAuth0User,
    updateUserBlockedStatus
} from "./empleadoFunction.ts";

interface Props  {
    show: boolean;
    onHide: () => void;
    title:string
    emp: Customer | null;
    fetchEmpleados: () => void;
}
export const EmpleadoModal = ({ show, onHide, title, emp, fetchEmpleados }: Props) =>{

    //Interface para Empleado, en la creacion los campos estaran vacios sino se llenan con los datos de la fila seleccionada de la tabla
    const [empleado, setEmpleado] = useState<Customer | undefined>(emp ? emp : {
        id: 0,
        name: "",
        lastname: "",
        phone: "",
        address: "",
        apartment: "",
        user: {
            id: 0,
            auth0Id: "",
            email: "",
            blocked: false,
            role: {
                id: "0",
                denomination: "",
                auth0RolId: "",
            },
        },
        orders: [],
    });

    //Token de Auth0
    const { getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState<string>('');

    //Roles
    const [roles, setRoles] = useState<Role[]>([]);
    const [rolId, setrolID] = useState("");

    //Campos adicionales para el formulario para crear un nuevo usuario de Auth0
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    //Campo para obtener el "user_id" de Auth0 en la creacion, es necesario guardarlo en BBDD para poder actualizar posteriormente el Rol y Blocked
    let [newAuth0ID] = useState("");

    //Obtener el Rol y el Status del Empleado actual para checkear si hubo algun cambio al empleado existente (Rol y Blocked)
    const prevRoleId = useRef(empleado?.user.role.id);
    const prevStatus = useRef(empleado?.user.blocked)

    //Renderizado del modal correspondiente segun donde se hizo click
    const renderModalTitle:boolean = title.toLowerCase().includes("bloquear")

    //Cada vez que se renderiza el Modal
    useEffect(() => {
        const onRender = async () => {
            try {
                //Obtengo el Token de Auth0
                const token = await getAccessTokenSilently();
                setToken(token);

                //Obtengo los Roles disponibles
                const roles = await fetchRoles(token);
                setRoles(roles);

            } catch (error) {
                console.error('Error al obtener datos en el renderizado:', error);
            }
        };
        //Se llama la funcion para ejecutarla
        onRender();
        //Se obtiene de manera correcta el rol seleccionado en el formulario [rolId]
    }, [rolId]);

    //Maneja los cambios del formulario de Empleado segun su interface + campos adicionales + dropdowns (Rol y Blocked)
    const handleChange = (e: React.ChangeEvent<EventTarget>) => {

        //Voy a observar 2 tipos de eventos, inputs y dropdowns
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;

        //Se actualiza el estado del empleado
        setEmpleado((prevEmpleado) => {
            //Se copian todas las propiedades del Empleado actual a la variable updatedEmpleado de tipo Customer
            const updatedEmpleado:Customer = { ...(prevEmpleado || {} as Customer) };

            //Campos de Rol (id, auth0RolId, denomination)
            if(name === "user.role"){
                const role = JSON.parse(value);
                // Actualizar el objeto Empleado del formulario en el campo "role" con los datos seleccionados
                updatedEmpleado.user = {
                    ...(updatedEmpleado.user || {} as User),
                    role: {
                        id: role.id,
                        denomination: role.denomination,
                        auth0RolId: role.auth0RolId
                    },
                };
                // Establecer el valor de rolID con el auth0RolId del rol seleccionado
                setrolID(role.auth0RolId);

            //Verificar si los campos pertenecen a User (id, auth0Id, email, blocked)
            } else if(name.startsWith("user.")){
                //Se utiliza para extraer el nombre del campo dentro de User: user.blocked => "blocked"
                const userFieldName = name.slice(5);
                // Actualizar el objeto Empleado del formulario en el campo correspondiente
                updatedEmpleado.user = {
                    ...(updatedEmpleado.user || {} as User),
                    // Asignar el valor del campo del formulario al objeto Empleado
                    // Si el campo es "blocked", convertir el valor de cadena a booleano
                    [userFieldName]: userFieldName === "blocked" ? value === "true" : value,
                };

                //Campos adicionales para crear un nuevo usuario de Auth0 (password y confirmPass)
            } else if (name === "password") {
                setPassword(value);
            } else if (name === "confirmPass") {
                setConfirmPassword(value);
            } else {
                //En este paso se observan los campos de Customer (id, name, lastname, phone, address, apartment)
                // Actualizar el objeto "updatedEmpleado" con el valor del campo "name"
                // utilizando la inferencia de tipos para garantizar la compatibilidad
                updatedEmpleado[name as keyof Customer] = value as never;
            }
            return updatedEmpleado;
        });
    };

    //Funcion para crear/editar en Auth0 y BBDD
    const handleSaveUpdate = async () => {

        const isNew = !empleado?.id;
        const userId = empleado?.user.auth0Id;
        let empleadoPost: Customer | undefined = undefined;

        if (!isNew && userId) {
            //PUT Auth0
            await handleAuth0User(isNew, userId);
        } else {
            //POST Auth0
            newAuth0ID = await handleAuth0User(isNew)

            //Si empleado no es "undefined" Creo el objeto empleadoPost a partir de una copia de Empleado y agrego el "user_id" de Auth0
           if (empleado){
               empleadoPost =  {
                   ...(empleado),
                   user: {
                       ...(empleado.user),
                       auth0Id: newAuth0ID,
                   },
               }
           }
        }

        const url = isNew
            ? "http://localhost:8080/api/v1/customers"
            : `http://localhost:8080/api/v1/customers/${empleado?.id}`;

        try {
            const response = await fetch(url, {
                method: isNew ? "POST" : "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: isNew ? JSON.stringify(empleadoPost) : JSON.stringify(empleado),
            });
            if (response.ok) {
                onHide();
                await fetchEmpleados();
                toast.success(isNew ? "Empleado Creado" : "Empleado Actualizado", {
                    position: "top-center",
                });
            } else {
                toast.error("Ah ocurrido un error", {
                    position: "top-center",
                });
            }
        } catch (error) {
            toast.error("Ah ocurrido un error" + error, {
                position: "top-center",
            });
        }
    };

    //Logica para crear/editar un usuario de AUTH0
    async function handleAuth0User(newUser:boolean, auth0Id?: string) {
        const userId:string = auth0Id ?? "";

        //POST Auth0
        if (newUser) {
            //Datos necesarios para crear un nuevo usuario de auth0
            const empleadoUser: Auth0User = {
                email: empleado?.user.email,
                password: password,
                blocked: empleado?.user.blocked,
            };

            //Creo el usuario y obtengo el "user_id"
            const userId = await newAuth0User(empleadoUser, token);

            //Asigno el rol al nuevo usuario, con el [rolId] seleccionado del formulario y del useEffect()
            await assignRoleToUser(userId, rolId, token);

            //Asigno a la variable "newAuth0ID"
            return userId;

        //PUT Auth0
        } else {

            //Si se selecciona otro rol distinto al existente llamo a la API de Auth0
            if (prevRoleId.current !== empleado?.user.role.id){

                //Obtener la lista de los roles del usuario
                const userRoles: string[] = await getUserRoles(userId, token);

                //Si existe alguno se procede a eliminarlo
                if (userRoles.length > 0) {
                    await deleteRolesFromUser(userId, userRoles, token)
                }

                //Asigno el nuevo rol al usuario
                await assignRoleToUser(userId, rolId, token);
            }

            //Si se selecciona otro estado distinto al existente llamo a la API de Auth0
            if(prevStatus.current !== empleado?.user.blocked){
                const block = empleado?.user.blocked
                await updateUserBlockedStatus(userId, block, token)
            }
        }
    }

    //Funcion para bloquear y desbloquear al Empleado desde la tabla
    const handleEstadoEmpleado = async () => {
        if (empleado) {

            const id = empleado.id;
            //Revierto el valor actual del status del empleado
            const blocked = !empleado?.user.blocked

            //PATCH Auth0
            const authId = empleado?.user.auth0Id ?? "";
            await updateUserBlockedStatus(authId, blocked, token)

            //PUT
            try {
                await fetch(`http://localhost:8080/api/v1/user/${id}/block?blocked=${blocked}`, {
                    method: 'PUT',
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                await fetchEmpleados();
                onHide();
                toast.success(`Estado del Empleado Actualizado`, {
                    position: "top-center",
                });
            } catch (error) {
                toast.error("Ah ocurrido un error", {
                    position: "top-center",
                });
            }
        }
    };

    return (
        <>
            {renderModalTitle
                ?
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Está seguro que desea modificar el estado del Empleado?<br/> <strong>{empleado?.name} {empleado?.lastname}</strong>?</p>
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
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formNombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            name="name"
                                            type="text"
                                            value={empleado?.name || ''}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formlastName">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            name="lastname"
                                            type="text"
                                            value={empleado?.lastname || ''}
                                            onChange={handleChange}
                                        />
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
                                            value={empleado?.user.email || ''}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formPhone">
                                        <Form.Label>Telefono</Form.Label>
                                        <Form.Control
                                            name="phone"
                                            type="text"
                                            value={empleado?.phone || ''}
                                            onChange={handleChange}
                                        />
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
                                            value={empleado?.address || ''}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formApartment">
                                        <Form.Label>Departamento</Form.Label>
                                        <Form.Control
                                            name="apartment"
                                            type="text"
                                            value={empleado?.apartment || ''}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formPassword">
                                        <Form.Label>Contraseña Provisoria</Form.Label>
                                        <Form.Control
                                            name="password"
                                            type="text"
                                            value={password}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formConfirmPass">
                                        <Form.Label>Confirmar Contraseña Provisoria</Form.Label>
                                        <Form.Control
                                            name="confirmPass"
                                            type="text"
                                            value={confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formRole">
                                        <Form.Label>Rol</Form.Label>
                                        <Form.Select
                                            name="user.role"
                                            value={JSON.stringify(empleado?.user.role)}
                                            onChange={handleChange}
                                        >
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
                                            value={empleado?.user.blocked.toString()}
                                            onChange={handleChange}
                                        >
                                            <option value="false">Activo</option>
                                            <option value="true">Bloqueado</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSaveUpdate}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    )
}