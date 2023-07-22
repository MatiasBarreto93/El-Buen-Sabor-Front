import {useEffect, useState} from "react";
import {useGenericGet} from "../../../../services/useGenericGet";
import {Ingredient} from "../../../../interfaces/ingredient";
import {ModalType} from "../../../../interfaces/ModalType";
import {useInitializeIngredient} from "./hooks/useInitializeIngredient";
import {Button, Table} from "react-bootstrap";
import {EditButton} from "../../../table/EditButton";
import {StatusButton} from "../../../table/StatusButton";
import {IngredientModal} from "./ingredientModal";

export const IngredientsTable = () => {
    const [refetch, setRefetch] = useState(false);
    const data = useGenericGet<Ingredient>("ingredients", "Ingredientes", refetch);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        setIngredients(data);
        setRefetch(false);
    }, [data]);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    const [title, setTitle] = useState("");

    const [newIngredient, setIngredient, createNewIngredient] = useInitializeIngredient(undefined);

    const handleClick = (newTitle: string, ingredient: Ingredient, modal: ModalType) => {
        setTitle(newTitle);
        setIngredient(ingredient);
        setModalType(modal);
        setShowModal(true);
    };

    return(
        <>
            <h5 className="encabezado mb-3">Ingredientes</h5>
            <Button onClick={() => handleClick("Nuevo Ingrediente", createNewIngredient(), ModalType.Create)}>Nuevo Ingrediente</Button>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Nombre</th>
                    <th>Rubro</th>
                    <th>Costo</th>
                    <th>Stock Actual</th>
                    <th>U.Medida</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {ingredients.map(ingredient => (
                    <tr key={ingredient.id}>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.categoryDenomination}</td>
                        <td>${ingredient.costPrice}</td>
                        <td>{ingredient.currentStock}</td>
                        <td>{ingredient.measurementDenomination}</td>
                        <td style={{ fontWeight: 'bold', color: ingredient.blocked ? '#D32F2F' : '#34A853' }}>{ingredient.blocked ? 'Bloqueado' : 'Activo'}</td>
                        <td><EditButton onClick={() => {handleClick("Editar Ingrediente", ingredient, ModalType.Edit)}}/></td>
                        <td><StatusButton
                            isBlocked={ingredient.blocked}
                            onClick={() => {handleClick(ingredient.blocked ? "¿Desbloquear Empleado?" : "¿Bloquear Empleado?",
                                ingredient,
                                ModalType.ChangeStatus)}}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {showModal && (
                <IngredientModal
                    ing={newIngredient}
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