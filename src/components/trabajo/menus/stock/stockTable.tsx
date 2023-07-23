import "./../../../styles/table.css"
import "./../../../styles/toggle-buttons.css"
import React, {useEffect, useState} from "react";
import {Table, ToggleButton, ToggleButtonGroup, Form} from "react-bootstrap";
import {useGenericGet} from "../../../../services/useGenericGet.ts";
import {Ingredient} from "../../../../interfaces/ingredient.ts";
import {Drink} from "../../../../interfaces/products.ts";
import {BuyButton} from "../../../table/BuyButton.tsx";
import {StockModal} from "./stockModal.tsx";
import {useInitializeIngredient} from "../ingredients/hooks/useInitializeIngredient.ts";
import {useInitializeDrink} from "../products/hooks/useInitializeDrink.ts";
import {Category} from "../../../../interfaces/category.ts";
import {StockFull} from "../../../table/StockFull.tsx";

export const StockTable = () => {

    const [refetch, setRefetch] = useState(false)

    //Category Ingredients
    const dataCategoryIngredients = useGenericGet<Category>("categories/filter/1", "Ingredientes", refetch);
    const [categoriesIngredients, setCategoriesIngredients] = useState<Category[]> ([]);
    const [selectedCategory, setSelectedCategory] = useState(0);


    //Ingredientes
    const dataIngredients = useGenericGet<Ingredient>("ingredients", "Ingredientes", refetch);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredient, setIngredient] = useInitializeIngredient(undefined);

    //Bebidas
    const dataDrinks = useGenericGet<Drink>("drinks", "Bebidas", refetch);
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [drink, setDrink] = useInitializeDrink(undefined);

    //Toggle
    const [selectedItemType, setSelectedItemType] = useState(1);
    const handleToggle = (selectedValue: number) => {
        setSelectedItemType(selectedValue);
    };

    useEffect(() => {
        setCategoriesIngredients(dataCategoryIngredients)
        setIngredients(dataIngredients);
        setDrinks(dataDrinks);
        setRefetch(false);
    }, [dataIngredients, dataDrinks, dataCategoryIngredients]);


    //ID Category en HTML Select
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(Number(event.target.value));
    };

    // Filtra la tabla en base a lo seleccionado en el HTML select
    const filterByCategory = (unfilteredIngredients: Ingredient[]) => {
        if (!selectedCategory) {
            return unfilteredIngredients;
        }
        return unfilteredIngredients.filter(ing => ing.categoryId === selectedCategory);
    };


    //Modal
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");

    const handleClickIngredient = (newTitle: string, ing: Ingredient) => {
        setTitle(newTitle);
        setIngredient(ing)
        setShowModal(true);
    };

    const handleClickDrink = (newTitle: string, dri: Drink) => {
        setTitle(newTitle);
        setDrink(dri)
        setShowModal(true);
    };

    const setStockFontColor = (currentStock: number, minStock: number) : string => {
        const percentage = ((currentStock - minStock) / currentStock ) * 100;

        if (percentage <= 20) {
            return '#D32F2F';
        }
        if (percentage <= 50) {
            return '#FBC02D';
        }
        return '#34A853';
    }

    return(
        <>
            <h5 className="encabezado mb-3">Stock</h5>
            <div className="d-flex justify-content-between">
                <ToggleButtonGroup type="radio" name="options" defaultValue={1} onChange={handleToggle}>
                    <ToggleButton id="tbg-radio-3" value={1} className={`toggle-button ${selectedItemType === 1 ? 'active' : ''}`}>
                        Ingredientes
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-4" value={2} className={`toggle-button ${selectedItemType === 2 ? 'active' : ''}`}>
                        Bebidas
                    </ToggleButton>
                </ToggleButtonGroup>
                {selectedItemType === 1 && (
                    <div className="d-flex">
                        <h5 className="mx-3" style={{marginTop: "5px"}}>Rubros de Ingredientes: </h5>
                        <Form.Group>
                            <Form.Select onChange={handleCategoryChange}>
                                <option value={0}>-</option>
                                {categoriesIngredients.map((category: Category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.denomination}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                )}
            </div>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    {selectedItemType === 1
                        ?
                        (
                            <>
                                <th>Nombre</th>
                                <th>U. Medida</th>
                                <th>Stock Actual</th>
                                <th>Stock Mimino</th>
                                <th>Stock Maximo</th>
                                <th>Diferencia</th>
                                <th>Estado</th>
                                <th></th>
                            </>
                        )
                        :
                        (
                            <>
                                <th>Nombre</th>
                                <th>Stock Actual</th>
                                <th>Stock Mimino</th>
                                <th>Stock Maximo</th>
                                <th>Diferencia</th>
                                <th>Estado</th>
                                <th></th>
                            </>
                        )
                    }
                </tr>
                </thead>
                <tbody>
                {selectedItemType === 1
                    ?
                    (
                        filterByCategory(ingredients).map((ing: Ingredient) => (
                            <tr key={ing.id}>
                                <td>{ing.name}</td>
                                <td>{ing.measurementDenomination}</td>
                                <td>{ing.currentStock}</td>
                                <td>{ing.minStock}</td>
                                <td>{ing.maxStock}</td>
                                <td style={{fontWeight: "bold" , color: setStockFontColor(ing.currentStock, ing.minStock)}}>{ing.currentStock - ing.minStock}</td>
                                <td style={{ fontWeight: "bold", color: ing.blocked ? "#D32F2F" : "#34A853" }}>
                                    {ing.blocked ? "Bloqueado" : "Activo"}
                                </td>
                                <td>
                                    {ing.currentStock === ing.maxStock ? (
                                        <StockFull/>
                                    ) : (
                                        <BuyButton onClick={() => handleClickIngredient(`Comprar ${ing.name}`, ing)}/>
                                    )}
                                </td>
                            </tr>
                        ))
                    )
                    :
                    (
                        drinks.map((dri: Drink) => (
                            <tr key={dri.id}>
                                <td>{dri.name}</td>
                                <td>{dri.currentStock}</td>
                                <td>{dri.minStock}</td>
                                <td>{dri.maxStock}</td>
                                <td style={{fontWeight: "bold", color: setStockFontColor(dri.currentStock, dri.minStock)}}>{dri.currentStock - dri.minStock}</td>
                                <td style={{ fontWeight: "bold", color: dri.blocked ? "#D32F2F" : "#34A853" }}>
                                    {dri.blocked ? "Bloqueado" : "Activo"}
                                </td>
                                <td>
                                    {dri.currentStock === dri.maxStock ? (
                                        <StockFull/>
                                    ) : (
                                        <BuyButton onClick={() => handleClickDrink(`Comprar ${dri.name}`, dri)}/>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
            {showModal && (
                <StockModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    setRefetch={setRefetch}
                    item={selectedItemType === 1 ? ingredient : drink}
                    title={title}
                />
            )}
        </>
    )
}