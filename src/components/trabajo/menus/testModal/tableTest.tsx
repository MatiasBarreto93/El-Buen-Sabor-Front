import {useEffect, useState} from "react";
import {useGenericGet} from "../../../../services/useGenericGet.ts";
import {Customer} from "../../../../interfaces/customer.ts";
import {ModalType} from "../../../../interfaces/ModalType.ts";
import {useInitializeCustomer} from "../employees/hooks/useInitializeCustomer.ts";
import {Button, Table} from "react-bootstrap";
import {ModalTest} from "./modalTest.tsx";
import "./../../../styles/table.css"
import {EditButton} from "../../../table/EditButton.tsx";
import {StatusButton} from "../../../table/StatusButton.tsx";

export const TableTest = () =>{

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
            <h5 className="encabezado mb-3">Empleados</h5>
            <Button onClick={() => handleClick("Nuevo Empleado", createNewEmployee(), ModalType.Create)}>Nuevo Empleado</Button>
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
                        <td style={{ fontWeight: 'bold', color: empleado.user.blocked ? '#D32F2F' : '#34A853' }}>{empleado.user.blocked ? 'Bloqueado' : 'Activo'}</td>
                        <td><EditButton onClick={() => {handleClick("Editar Empleado", empleado, ModalType.Edit)}}/></td>
                        <td><StatusButton
                            isBlocked={empleado.user.blocked}
                            onClick={() => {handleClick(empleado.user.blocked ? "¿Desbloquear Empleado?" : "¿Bloquear Empleado?",
                                empleado,
                                ModalType.ChangeStatus)}}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {showModal && (
                <ModalTest
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
