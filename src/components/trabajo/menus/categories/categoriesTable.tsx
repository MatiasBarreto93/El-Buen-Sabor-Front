import {useEffect, useState} from "react";
import {Category} from "../../../../interfaces/category";
import "./../../../styles/table.css"
import "./../../../styles/toggle-buttons.css"
import {Button, Table, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {ModalType} from "../../../../interfaces/ModalType";
import {useInitializeCategory} from "./hooks/useInitializeCategory";
import {CategoryModal} from "./categoryModal";
import {EditButton} from "../../../table/EditButton.tsx";
import {StatusButton} from "../../../table/StatusButton.tsx";
import {useGenericCacheGet} from "../../../../services/useGenericCacheGet.ts";

export const CategoriesTable = () => {
    const [refetch, setRefetch] = useState(false)

    const {data, fetchData} = useGenericCacheGet<Category>("categories", "Categorías");
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedItemType, setSelectedItemType] = useState(1);

    useEffect(() => {
        setCategories(data);
        if (refetch){
            fetchData();
            setRefetch(false);
        }
    }, [data, refetch]);


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

    const handleToggle = (selectedValue: number) => {
        setSelectedItemType(selectedValue);
    };

    return(
        <>
            <h5 className="encabezado mb-3">Rubros</h5>
            <div className="d-flex justify-content-between">
            <Button onClick={() => handleClick("Nueva Categoria", createNewCategory(), ModalType.Create)}>
                Nueva Categoría
            </Button>
            <ToggleButtonGroup type="radio" name={"options"} defaultValue={1} onChange={handleToggle}>
                <ToggleButton id="tbg-radio-1" value={1} className={`toggle-button ${selectedItemType === 1 ? 'active' : ''}`}>
                    Ingredientes
                </ToggleButton>
                <ToggleButton id="tbg-radio-2" value={2} className={`toggle-button ${selectedItemType === 2 ? 'active' : ''}`}>
                    Productos
                </ToggleButton>
            </ToggleButtonGroup>
            </div>
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
                {categories
                    .filter((category) => category.itemTypeId === selectedItemType)
                    .map((category) => (
                        <tr key={category.id}>
                            <td>{category.denomination}</td>
                            <td>{category.categoryFatherDenomination}</td>
                            <td style={{ fontWeight: "bold", color: category.blocked ? "#D32F2F" : "#34A853" }}>
                                {category.blocked ? "Bloqueado" : "Activo"}
                            </td>
                            <td>
                                <EditButton onClick={() => handleClick("Editar Categoría", category, ModalType.Edit)} />
                            </td>
                            <td>
                                <StatusButton
                                    isBlocked={category.blocked}
                                    onClick={() =>
                                        handleClick(
                                            category.blocked ? "¿Desbloquear Categoría?" : "¿Bloquear Categoría?",
                                            category,
                                            ModalType.ChangeStatus
                                        )
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {showModal && (
                <CategoryModal
                    cat={newCategory}
                    title={title}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    setRefetch={setRefetch}
                    modalType={modalType}
                    initialItemTypeId={selectedItemType}
                />
            )}
        </>
    )

}