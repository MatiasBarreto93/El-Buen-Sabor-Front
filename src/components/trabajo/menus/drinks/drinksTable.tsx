import {useEffect, useState} from "react";
import {useGenericGet} from "../../../../services/useGenericGet";
import {Drink} from "../../../../interfaces/products";
import {ModalType} from "../../../../interfaces/ModalType";
import {EditButton} from "../../../table/EditButton";
import {StatusButton} from "../../../table/StatusButton";
import {ProductModal} from "../products/productModal";
import {useInitializeDrink} from "./hooks/useInitializeDrink";
import {Button, Table} from "react-bootstrap";
import {DrinkModal} from "./drinkModal";

export const DrinksTable = () => {

    const [refetch, setRefetch] = useState(false)
    const data = useGenericGet<Drink>("drinks", "Bebidas", refetch);
    const [drinks, setDrinks] = useState<Drink[]>([]);

    useEffect(() => {
        setDrinks(data);
        setRefetch(false);
    }, [data]);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    const [title, setTitle] = useState("");

    const [newDrink, setDrink, createNewDrink] = useInitializeDrink(undefined);

    const handleClick = (newTitle: string, dr: Drink, modal: ModalType) => {
        setTitle(newTitle);
        setDrink(dr);
        setModalType(modal)
        setShowModal(true);
    }

    return(
        <>
            <h5 className="encabezado mb-3">Bebidas</h5>
            <Button onClick={() => handleClick("Nueva Bebida", createNewDrink(), ModalType.Create)}>Nueva Bebida</Button>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Nombre</th>
                    <th>Rubro</th>
                    <th>Precio</th>
                    <th>Stock Actual</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {drinks.map(drink => (
                    <tr key={drink.id}>
                        <td>{drink.name}</td>
                        <td>{drink.categoryDenomination}</td>
                        <td>${drink.sellPrice}</td>
                        <td>{drink.currentStock}</td>
                        <td style={{ fontWeight: 'bold', color: drink.blocked ? '#D32F2F' : '#34A853' }}>{drink.blocked ? 'Bloqueado' : 'Activo'}</td>
                        <td><EditButton onClick={() => {handleClick("Editar Bebida", drink, ModalType.Edit)}}/></td>
                        <td><StatusButton
                            isBlocked={drink.blocked}
                            onClick={() => {handleClick(drink.blocked ? "¿Desbloquear Bebida?" : "¿Bloquear Bebida?",
                                drink,
                                ModalType.ChangeStatus)}}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {showModal && (
                <DrinkModal
                    dr={newDrink}
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