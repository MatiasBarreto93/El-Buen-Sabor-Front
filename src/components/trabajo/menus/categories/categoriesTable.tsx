import {useEffect, useState} from "react";
import {Category} from "../../../../types/category";
import {LockFill, PencilFill, UnlockFill} from "react-bootstrap-icons";
import {Button, Table} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";
import {CategoryModal} from "./categoryModal";

export const CategoriesTable = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch("http://localhost:8080/api/v1/categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data)
                console.log(data)
            } else {
                console.error("Error fetching data:", response.status);
            }
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    }

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<Category | null>(null);

    const handleClick = (newTitle: string, category?: Category) => {
        setTitle(newTitle);
        setCategory(category || null);
        setShowModal(true);
    };

    return(
        <>
            <Button onClick={() => handleClick("Nueva Categoría")}>
                Nueva Categoría
            </Button>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Denominación</th>
                    <th>Categoría Padre</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {categories.map(category => (
                    <tr key={category.id}>
                        <td>{category.denomination}</td>
                        <td>{category.fatherCategory?.denomination}</td>
                        <td style={{ fontWeight: 'bold', color: category.isBanned ? '#D32F2F' : '#34A853' }}>
                            {category.isBanned ? 'Bloqueado' : 'Activo'}
                        </td>
                        <td>
                            <PencilFill
                                color="#FBC02D"
                                size={24}
                                onClick={() => {
                                    handleClick("Editar Categoría", category);
                                }}
                                title="Editar Categoría"
                                onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            />
                        </td>
                        <td>
                            {/*ACA HAY QUE BUSCAR LA FORMA DE OBTENER EL ESTADO DEL EMPLEADO*/}
                            {category.isBanned ?
                                <LockFill
                                    color="#D32F2F"
                                    size={24}
                                    title="Bloquear Categoría"
                                    onClick={() => handleClick("¿Desbloquear Categoría?", category)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />
                                :
                                <UnlockFill
                                    color="#34A853"
                                    size={24}
                                    title="Desbloquear Categoría"
                                    onClick={() => handleClick("¿Bloquear Categoría?", category)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {showModal && (
                <CategoryModal
                    cat={category}
                    title={title}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    fetchCategories={fetchCategories}
                />
            )}
        </>
    )

}