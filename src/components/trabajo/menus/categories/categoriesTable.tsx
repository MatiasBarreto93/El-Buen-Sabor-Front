import {useEffect, useState} from "react";
import {Category} from "../../../../interfaces/category";
import "./../../../styles/table.css"
import {LockFill, PencilFill, UnlockFill} from "react-bootstrap-icons";
import {Button, Table} from "react-bootstrap";
import {useGenericGet} from "../../../../services/useGenericGet";
import {ModalType} from "../../../../interfaces/ModalType";
import {useInitializeCategory} from "./hooks/useInitializeCategory";
import {CategoryModal} from "./categoryModal";

export const CategoriesTable = () => {
    const [refetch, setRefetch] = useState(false)

    const data = useGenericGet<Category>("categories", "Categorías", refetch);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        setCategories(data);
        setRefetch(false);
    }, [data]);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    const [title, setTitle] = useState("");

    const [newCategory, setCategory, createNewCategory] = useInitializeCategory(undefined);

    const handleClick = (newTitle: string, category: Category, modal: ModalType) => {
        setTitle(newTitle);
        setCategory(category);
        setModalType(modal)
        setShowModal(true);
    };

    return(
        <>
            <Button onClick={() => handleClick("Nueva Categoria", createNewCategory(), ModalType.Create)}>
                Nueva Categoría
            </Button>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Denominación</th>
                    <th>Categoría Principal</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {categories.map(category => (
                    <tr key={category.id}>
                        <td>{category.denomination}</td>
                        <td>{category.categoryFatherDenomination}</td>
                        <td style={{ fontWeight: 'bold', color: category.blocked ? '#D32F2F' : '#34A853'}}>
                            {category.blocked ? 'Bloqueado' : 'Activo'}
                        </td>
                        <td>
                            <PencilFill
                                color="#FBC02D"
                                size={24}
                                onClick={() => {
                                    handleClick("Editar Categoría", category, ModalType.Edit);
                                }}
                                title="Editar Categoría"
                                onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                onMouseLeave={() => {document.body.style.cursor = 'default'}}
                            />
                        </td>
                        <td>
                            {category.blocked ?
                                <LockFill
                                    color="#D32F2F"
                                    size={24}
                                    title="Desbloquear Categoría"
                                    onClick={() => handleClick("¿Desbloquear Categoría?", category, ModalType.ChangeStatus)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />
                                :
                                <UnlockFill
                                    color="#34A853"
                                    size={24}
                                    title="Bloquear Categoría"
                                    onClick={() => handleClick("¿Bloquear Categoría?", category, ModalType.ChangeStatus)}
                                    onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                                    onMouseLeave={() => {document.body.style.cursor = 'default'}} />}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {showModal && (
                <CategoryModal cat={newCategory}
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