import {useEffect, useState} from "react";
import {Customer} from "../../../../interfaces/customer.ts";
import {ModalType} from "../../../../interfaces/ModalType.ts";
import {useInitializeCustomer} from "../employees/hooks/useInitializeCustomer.ts";
import {Button, Table} from "react-bootstrap";
import {CustomerModal} from "./customerModal.tsx";
import "./../../../styles/table.css"
import {EditButton} from "../../../table/EditButton.tsx";
import {StatusButton} from "../../../table/StatusButton.tsx";
import {useGenericCacheGet} from "../../../../services/useGenericCacheGet.ts";

export const CustomersTable = () => {

    //Campo para volver a solicitar los Clientes cuando se hizo exitosamente un POST/PUT desde el modal
    const [refetch, setRefetch] = useState(false)

    //Obtener los Clientes para llenar la tabla
    const {data, fetchData} = useGenericCacheGet<Customer>("customers/cliente-role","Clientes");
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        setCustomers(data);
        if (refetch){
            fetchData();
            setRefetch(false);
        }
    }, [data, refetch]);

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
            <h5 className="encabezado mb-3">Clientes</h5>
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
                        <td><EditButton onClick={() => {handleClick("Editar Cliente", customer, ModalType.Edit)}}/></td>
                        <td><StatusButton
                            isBlocked={customer.user.blocked}
                            onClick={() => {handleClick(customer.user.blocked ? "¿Desbloquear Cliente?" : "¿Bloquear Cliente?",
                                customer,
                                ModalType.ChangeStatus)}}/>
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