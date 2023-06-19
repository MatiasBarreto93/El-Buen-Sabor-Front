import {useEffect, useState} from "react";
import {useGenericGet} from "../../../../services/useGenericGet.ts";
import {Customer} from "../../../../interfaces/customer.ts";
import {ModalType} from "../../../../interfaces/ModalType.ts";
import {useInitializeCustomer} from "../employees/hooks/useInitializeCustomer.ts";
import {Button, Table} from "react-bootstrap";
import {LockFill, PencilFill, UnlockFill} from "react-bootstrap-icons";
import {CustomerModal} from "./customerModal.tsx";

export const CustomersTable = () => {

    //Campo para volver a solicitar los Clientes cuando se hizo exitosamente un POST/PUT desde el modal
    const [refetch, setRefetch] = useState(false)

    //Obtener los Clientes para llenar la tabla
    const data = useGenericGet<Customer>("customers/cliente-role","Clientes" ,refetch);
    const [customers, setCustomers] = useState<Customer[]>([]);
    useEffect(() =>{
        setCustomers(data);
        setRefetch(false);
    },[data])

    //Manejo de Modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    const [title, setTitle] = useState("");

    //Se inicializa el Empleado
    const [newCustomer, setNewCustomer, createNewEmployee] = useInitializeCustomer(undefined);

    //Logica del Modal
    const handleClick = (newTitle: string, customer: Customer, modal: ModalType) => {
        setTitle(newTitle);
        setNewCustomer(customer);
        setModalType(modal)
        setShowModal(true);
    };


    return(
        <>
            <Button onClick={() => handleClick("Nuevo Cliente", createNewEmployee(), ModalType.Create)}>
                Nuevo Cliente
            </Button>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Nombre Apellido</th>
                    <th>Email</th>
                    <th>Direccion</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {customers.map(customer => (
                    <tr key={customer.id}>
                        <td>{customer.name} {customer.lastname}</td>
                        <td>{customer.user.email}</td>
                        <td>{customer.address}, {customer.apartment}</td>
                        <td style={{ fontWeight: 'bold', color: customer.user.blocked ? '#D32F2F' : '#34A853' }}>
                            {customer.user.blocked ? 'Bloqueado' : 'Activo'}
                        </td>
                        <td>
                            <PencilFill
                                color="#FBC02D"
                                size={24}
                                onClick={() => {
                                    handleClick("Editar Cliente", customer, ModalType.Edit);
                                }}
                                title="Editar Empleado"
                                onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            />
                        </td>
                        <td>
                            {customer.user.blocked ?
                                <LockFill
                                    color="#D32F2F"
                                    size={24}
                                    title="Bloquear Empleado"
                                    onClick={() => handleClick("¿Desbloquear Cliente?", customer, ModalType.ChangeStatus)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />
                                :
                                <UnlockFill
                                    color="#34A853"
                                    size={24}
                                    title="Desbloquear Empleado"
                                    onClick={() => handleClick("¿Bloquear Cliente?", customer, ModalType.ChangeStatus)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {showModal && (
                <CustomerModal
                    cus={newCustomer}
                    title={title}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    setRefetch={setRefetch}
                    modalType={modalType}
                />
            )}
        </>
    )
}