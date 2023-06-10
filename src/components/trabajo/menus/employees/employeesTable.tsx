import {useEffect, useState} from "react";
import {Customer} from "../../../../interfaces/customer.ts";
import "./../../../styles/table.css"
import {LockFill, PencilFill, UnlockFill} from "react-bootstrap-icons";
import {Button, Table} from "react-bootstrap";
import {EmployeeModal} from "./employeeModal.tsx";
import {useGenericGet} from "../../../../services/useGenericGet.ts";
import {useInitializeCustomer} from "./hooks/useInitializeCustomer.ts";
import {ModalType} from "../../../../interfaces/ModalType.ts";

export const EmployeesTable = () =>{

    //Campo para volver a solicitar los Empleados cuando se hizo exitosamente un POST/PUT desde el modal
    const [refetch, setRefetch] = useState(false)

    //Obtener los Empleados para llenar la tabla
    const data = useGenericGet<Customer>("customers/different-role/5","Empleados" ,refetch);
    const [empleados, setEmpleados] = useState<Customer[]>([]);
    useEffect(() =>{
        setEmpleados(data);
        setRefetch(false);
    },[data])

    //Manejo de Modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    const [title, setTitle] = useState("");

    //Se inicializa el Empleado
    const [newEmpleado, setEmpleado, createNewEmployee] = useInitializeCustomer(undefined);

    //Logica del Modal
    const handleClick = (newTitle: string, empleado: Customer, modal: ModalType) => {
        setTitle(newTitle);
        setEmpleado(empleado);
        setModalType(modal)
        setShowModal(true);
    };

    return(
        <>
            <Button onClick={() => handleClick("Nuevo Empleado", createNewEmployee(), ModalType.Create)}>
                Nuevo Empleado
            </Button>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Nombre Apellido</th>
                    <th>Email</th>
                    <th>Direccion</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {empleados.map(empleado => (
                    <tr key={empleado.id}>
                        <td>{empleado.name} {empleado.lastname}</td>
                        <td>{empleado.user.email}</td>
                        <td>{empleado.address}, {empleado.apartment}</td>
                        <td>{empleado.user.role.denomination}</td>
                        <td style={{ fontWeight: 'bold', color: empleado.user.blocked ? '#D32F2F' : '#34A853' }}>
                            {empleado.user.blocked ? 'Bloqueado' : 'Activo'}
                        </td>
                        <td>
                            <PencilFill
                                color="#FBC02D"
                                size={24}
                                onClick={() => {
                                    handleClick("Editar Empleado", empleado, ModalType.Edit);
                                }}
                                title="Editar Empleado"
                                onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            />
                        </td>
                        <td>
                            {empleado.user.blocked ?
                                <LockFill
                                    color="#D32F2F"
                                    size={24}
                                    title="Bloquear Empleado"
                                    onClick={() => handleClick("¿Desbloquear Empleado?", empleado, ModalType.ChangeStatus)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />
                                :
                                <UnlockFill
                                    color="#34A853"
                                    size={24}
                                    title="Desbloquear Empleado"
                                    onClick={() => handleClick("¿Bloquear Empleado?", empleado, ModalType.ChangeStatus)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {showModal && (
                <EmployeeModal
                    emp={newEmpleado}
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
