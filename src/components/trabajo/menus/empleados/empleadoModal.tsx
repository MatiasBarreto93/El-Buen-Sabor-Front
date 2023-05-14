import { Button, Col, Form, Modal, Row} from "react-bootstrap";
import React, { useState} from "react";
import {toast} from "react-toastify";
import {Customer} from "../../../../types/customer.ts";
interface Props {
    show: boolean;
    onHide: () => void;
    title:string
    emp: Customer;
    fetchEmpleados: () => void;
}
export const EmpleadoModal = ({ show, onHide, title, emp, fetchEmpleados }: Props)=>{

    const [empleado, setEmpleado] = useState<Customer | undefined>(emp ? emp : {
        id: 0,
        name: "",
        lastname: "",
        phone: "",
        email: "",
        address: "",
        apartment: "",
        user: 0,
        orders: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmpleado((prevState) => prevState ? {
            ...prevState,
            [name]: value,
        } : undefined);
    };

    const handleSaveUpdate = async () => {
        const isNew = !empleado.id;
        const url = isNew
            ? "http://localhost:8080/api/v1/customers"
            : `http://localhost:8080/api/v1/customers/${empleado.id}`;

        try {
            const response = await fetch(url, {
                method: isNew ? "POST" : "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(empleado),
            });

            //Si la transaccion es correcta
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
            console.log(error);
            // Mostrar mensaje de error al usuario
        }
    };

    const borrarInstrumento = async () => {
        if (empleado) {
            const id = empleado.id;
            try {
                await fetch(`http://localhost:8080/api/v1/customers${id}`, {
                    method: "DELETE",
                });
                onHide();
                await fetchEmpleados();
                toast.success("Empleado Borrado", {
                    position: "top-center",
                });
            } catch (error) {
                toast.error("Ah ocurrido un error", {
                    position: "top-center",
                });
            }
        }
    };

    //Validacion de TITULOS permitidos
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
                        <Button variant="danger" onClick={borrarInstrumento}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
                :
                <Modal show={show} onHide={onHide} centered backdrop="static">
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
                                            name="nombre"
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
                                            name="lastName"
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
                                            name="email"
                                            type="text"
                                            value={empleado?.email || ''}
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
                                            name="adress"
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
                                            name="Apartment"
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
                                            value={""}
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
                                            value={""}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formRole">
                                        <Form.Label>Rol</Form.Label>
                                        <Form.Control
                                            name="role"
                                            type="text"
                                            value={""}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formBanned">
                                        <Form.Label>Estado</Form.Label>
                                        <Form.Control
                                            name="banned"
                                            type="text"
                                            value={""}
                                            onChange={handleChange}
                                        />
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