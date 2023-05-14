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


    useEffect(() => {
        fetchEmpleados();
    }, []);

    async function fetchEmpleados() {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch("http://localhost:8080/api/v1/customers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                console.log(token)
                setEmpleados(data)
            } else {
                console.log(token)
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
        setEmpleado(empleado);
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
                        <td>{empleado.email}</td>
                        <td>{empleado.address}, {empleado.apartment}</td>
                        <td>Rol</td>
                        <td>Estado</td>
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
                            {/*ACA HAY QUE BUSCAR LA FORMA DE OBTENER EL ESTADO DEL EMPLEADO*/}
                            {empleado.user ?
                                <LockFill
                                    color="#D32F2F"
                                    size={24}
                                    title="Bloquear Empleado"
                                    onClick={() => handleClick("¿Bloquear Empleado?", empleado)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />
                                :
                                <UnlockFill
                                    color="#34A853"
                                    size={24}
                                    title="Desbloquear Empleado"
                                    onClick={() => handleClick("¿Desbloquear Empleado?", empleado)}
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
