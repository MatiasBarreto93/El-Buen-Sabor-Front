import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";
import {Auth0Roles, Auth0User, Customer, Role, User} from "../../../../types/customer.ts";
import {useAuth0} from "@auth0/auth0-react";

interface Props  {
    show: boolean;
    onHide: () => void;
    title:string
    emp: Customer | null;
    fetchEmpleados: () => void;
}
export const EmpleadoModal = ({ show, onHide, title, emp, fetchEmpleados }: Props) =>{

    const { getAccessTokenSilently } = useAuth0();
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

    //Roles para llenar el dropdown
    const [roles, setRoles] = useState<Role[]>([]);
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch("http://localhost:8080/api/v1/roles", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setRoles(data);
                } else {
                    // Handle error
                    console.error("Error fetching roles:", response.status);
                }
            } catch (error) {
                // Handle error
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);


    const [rolId, setrolID] = useState("");
    useEffect(() => {
        //Actualizo correctamente el rolID seleccionado en el dropdown
    }, [rolId]);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    let [newAuth0ID] = useState("");

    const handleChange = (e: React.ChangeEvent<EventTarget>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setEmpleado((prevEmpleado) => {
            const updatedEmpleado:Customer = { ...(prevEmpleado || {} as Customer) };

            if (name === "user.role") {
                const role = JSON.parse(value);
                updatedEmpleado.user = {
                    ...(updatedEmpleado.user || {} as User),
                    role: {
                        id: role.id,
                        denomination: role.denomination,
                        auth0RolId: role.auth0RolId
                    },
                };
                setrolID(role.auth0RolId);
            } else if (name.startsWith("user.")) {
                const userFieldName = name.slice(5); // Remove "user." from the name
                updatedEmpleado.user = {
                    ...(updatedEmpleado.user || {} as User),
                    [userFieldName]: userFieldName === "blocked" ? value === "true" : value,
                };
            } else if (name === "password") {
                setPassword(value);
            } else if (name === "confirmPass") {
                setConfirmPassword(value);
            } else {
                updatedEmpleado[name as keyof Customer] = value as never;
            }
            return updatedEmpleado;
        });
    };

    const handleSaveUpdate = async () => {
        const isNew = !empleado?.id;
        const userId = empleado?.user.auth0Id;
        if (!isNew && userId) {
            await handleAuth0User(isNew, userId);
        } else {
            newAuth0ID = await handleAuth0User(isNew)
        }
        const empleadoPost = {
            ...empleado,
            user:{
                ...empleado?.user,
                auth0Id: newAuth0ID,
            }
        }
        const url = isNew
            ? "http://localhost:8080/api/v1/customers"
            : `http://localhost:8080/api/v1/customers/${empleado?.id}`;

        try {
            const token = await getAccessTokenSilently();

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
                //setIsPost(isNew)
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

    const prevRoleId = useRef(empleado?.user.role.id);
    const prevStatus = useRef(empleado?.user.blocked)
    //Logica para crear un nuevo usuario en AUTH0
    async function handleAuth0User(newUser:boolean, auth0Id?: string) {
        const userId:string = auth0Id ?? "";
        if (newUser) {
            const empleadoUser: Auth0User = {
                email: empleado?.user.email,
                password: password,
                blocked: empleado?.user.blocked,
            };
            const userId = await newAuth0User(empleadoUser);

            const userRoles: string[] = await getUserRoles(userId);
            if (userRoles.length > 0) {
                await deleteRolesFromUser(userId, userRoles)
            }
            await assignRoleToUser(userId, rolId);
            return userId;
        } else {
            //Si el rol se cambio en el formulario hago las llamadas a la API para colocar el nuevo ROL
            if (prevRoleId.current !== empleado?.user.role.id){
                const userRoles: string[] = await getUserRoles(userId);
                if (userRoles.length > 0) {
                    await deleteRolesFromUser(userId, userRoles)
                }
                await assignRoleToUser(userId, rolId);
            } else if(prevStatus.current !== empleado?.user.blocked){
                const block = empleado?.user.blocked
                await updateUserBlockedStatus(userId, block)
            }
        }
    }

     async function newAuth0User(newUser: Auth0User) {
        try {
            const token = await getAccessTokenSilently();

            const requestBody = {
                email: newUser.email,
                password: newUser.password,
                blocked: newUser.blocked,
            };

            const response = await fetch('http://localhost:8080/api/v1/auth0/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const responseBody = await response.json();
                const userId = responseBody.user_id;
                return userId;
            }
        } catch (error) {
            console.error('Error creating new user:', error);
            toast.error("Ah ocurrido un error" + error, {
                position: "top-center",
            });
        }
    }
    //Asignar el rol
    //1ro Verifico si el usuario tiene roles
    async function getUserRoles(userId: string): Promise<string[]> {
        try {
            const token = await getAccessTokenSilently();
            const encodedUserId = encodeURIComponent(userId).replaceAll('|', '%7C');
            const response = await fetch(`http://localhost:8080/api/v1/auth0/users/${encodedUserId}/roles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const roles = await response.json();
                return roles.map((role: Auth0Roles) => role.id);
            } else {
                console.error('Error retrieving user roles:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Error retrieving user roles:', error);
            return [];
        }
    }
    //2do elimina el rol actual por que en auth0 se puede tener mas de un rol
    async function deleteRolesFromUser(userId: string, userRoles: string[]) {
        try {
            const token = await getAccessTokenSilently();
            const encodedUserId = encodeURIComponent(userId).replaceAll('|', '%7C');

            const response = await fetch(`http://localhost:8080/api/v1/auth0/users/${encodedUserId}/roles`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ roles: userRoles }),
            });

            if (!response.ok) {
                toast.error('Ah ocurrido un error', {
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error('Error deleting roles from user:', error);
            toast.error('Ah ocurrido un error' + error, {
                position: 'top-center',
            });
        }
    }
    //4ro se asigna
    async function assignRoleToUser(userId: string, roleId: string) {
        try {
            const token = await getAccessTokenSilently();
            const url = `http://localhost:8080/api/v1/auth0/users/${roleId}/roles`;

            const requestBody = { users: [userId] };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                toast.error('Ha ocurrido un error', {
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error('Error assigning user to role:', error);
            toast.error('Ha ocurrido un error' + error, {
                position: 'top-center',
            });
        }
    }
    //Update al blocked de auth0 del empleado
    async function updateUserBlockedStatus(userId: string, userBlock: boolean | undefined) {
        try {
            const token = await getAccessTokenSilently();
            const encodedUserId = encodeURIComponent(userId).replaceAll('|', '%7C');

            const requestBody = { blocked: userBlock };

            const response = await fetch(`http://localhost:8080/api/v1/auth0/users/${encodedUserId}/block`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                toast.error('Ha ocurrido un error', {
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error('Error assigning user to role:', error);
            toast.error('Ha ocurrido un error' + error, {
                position: 'top-center',
            });
        }
    }

    const handleEstadoEmpleado = async () => {

        const token = await getAccessTokenSilently();

        if (empleado) {
            const id = empleado.id;
            const blocked = !empleado.user.blocked
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
        const authId = empleado?.user.auth0Id ?? "";
        const block = !empleado?.user.blocked
        await updateUserBlockedStatus(authId, block)
    };

    //Validacion de TITULOS permitidos
    //Cambiar esto a un flag con un boolean
    const validTitles = ["Nuevo Empleado", "Editar Empleado", "¿Bloquear Empleado?", "¿Desbloquear Empleado?"];
    if (!validTitles.includes(title)) {
        return (
            toast.error("Error!, la funcion requerida no existe", {
                position: "top-center"
            }))
    }

    return (
        <>
            {title.toLowerCase().includes("quear")
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