import {useEffect, useState} from "react";
import {Customer} from "../../../../types/customer.ts";
import "./../../../styles/table.css"
import {LockFill, PencilFill, UnlockFill} from "react-bootstrap-icons";
import {Button, Table} from "react-bootstrap";
import {EmpleadoModal} from "./empleadoModal.tsx";
import {useAuth0} from "@auth0/auth0-react";


export const EmpleadosTable = () =>{
    const [empleados, setEmpleados] = useState<Customer[]>([]);
    const { getAccessTokenSilently } = useAuth0();

    //Ver que es lo de deps[]
    useEffect(() => {
        fetchEmpleados();
    }, []);

    async function fetchEmpleados() {
        try {
            const token = await getAccessTokenSilently();
            //Todos menos los clientes
            const response = await fetch("http://localhost:8080/api/v1/customers/different-role/5", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setEmpleados(data)
                console.log(data)
            } else {
                console.error("Error fetching data:", response.status);
            }
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    }

    //Manejo de Modal
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [empleado, setEmpleado] = useState<Customer | null>(null);

    //Logica del Modal
    const handleClick = (newTitle: string, empleado?: Customer) => {
        setTitle(newTitle);
        setEmpleado(empleado || null);
        setShowModal(true);
    };

    return(
        <>
            <Button onClick={() => handleClick("Nuevo Empleado")}>
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
                                    handleClick("Editar Empleado", empleado);
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
                                    onClick={() => handleClick("¿Desbloquear Empleado?", empleado)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />
                                :
                                <UnlockFill
                                    color="#34A853"
                                    size={24}
                                    title="Desbloquear Empleado"
                                    onClick={() => handleClick("¿Bloquear Empleado?", empleado)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {showModal && (
                <EmpleadoModal
                    emp={empleado}
                    title={title}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    fetchEmpleados={fetchEmpleados}
                />
            )}
        </>
    )
}
