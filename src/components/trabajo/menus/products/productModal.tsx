import React, {useEffect, useState} from "react";
import {ModalType} from "../../../../interfaces/ModalType";
import {Product} from "../../../../interfaces/products";
import {useGenericPost} from "../../../../services/useGenericPost";
import {useGenericPut} from "../../../../services/useGenericPut";
import {useGenericChangeStatus} from "../../../../services/useGenericChangeStatus";
import {Ingredient, IngredientQuantity} from "../../../../interfaces/ingredient";
import {useGenericGet} from "../../../../services/useGenericGet";
import {useInitializeIngredient} from "../ingredients/hooks/useInitializeIngredient";
import {Category} from "../../../../interfaces/category";
import {Modal} from "react-bootstrap";

interface Props {
    show: boolean;
    onHide: () => void;
    title:string
    prod: Product;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    modalType: ModalType;
}

export const ProductModal = ({show, onHide, title, prod, setRefetch, modalType}: Props) => {

    //Customs Hooks Generics
    const genericPost = useGenericPost();
    const genericPut = useGenericPut();
    const updateProductStatus = useGenericChangeStatus();

    //Ingredients HTMLSelect
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const dataIngredient = useGenericGet<Ingredient>("ingredients", "Ingredientes");

    //Recipe
    const [ingrediente, setIngrediente] = useInitializeIngredient(undefined);
    const [selectedIngredients, setSelectedIngredients] = useState<IngredientQuantity[]>([]);
    const [quantity, setQuantity] = useState(0);

    //Categories HTMLSelect
    const dataCategories = useGenericGet<Category>(`categories/filter/1`, "Categorías");
    const [categories, setCategories] = useState<Category[]> ([]);
    const [selectedCategory, setSelectedCategory] = useState(0);

    //Fill modal form inputs fields with ingredients & categories
    useEffect(() =>{
        setIngredients(dataIngredient)
        setCategories(dataCategories);
    },[dataIngredient, dataCategories])

    const handleSaveUpdate = async(product: Product) => {
        const isNew = product.id === 0;
        if (!isNew) {
            await genericPut<Ingredient>("products", product.id, product, "Producto Editado");
        } else {
            await genericPost<Ingredient>("products", "Producto Creado", product);
        }
        setRefetch(true);
        onHide();
    }

    const handleStateProduct = async () => {
        if(prod) {
            const id = prod.id;
            const isBlocked = !prod.blocked;

            await updateProductStatus(id, isBlocked, "products", "Producto");

            setRefetch(true);
            onHide();
        }
    }

    const [step, setStep] = useState(0);

    return (
        <>
            {modalType === ModalType.ChangeStatus
                ?
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Está seguro que desea modificar el estado del Producto?<br/> <strong>{prod.name}</strong>?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleStateProduct}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
                :
                <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-xl">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>

                </Modal>
            }
        </>
    )
}