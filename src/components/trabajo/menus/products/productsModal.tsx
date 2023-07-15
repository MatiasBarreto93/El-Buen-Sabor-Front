import {ModalType} from "../../../../interfaces/ModalType.ts";
import {Product} from "../../../../interfaces/products.ts";
import React, {useEffect, useState} from "react";
import {useGenericPost} from "../../../../services/useGenericPost.ts";
import {useGenericPut} from "../../../../services/useGenericPut.ts";
import {useGenericChangeStatus} from "../../../../services/useGenericChangeStatus.ts";

import '../../../styles/HorizontalStepper.css'
import {Ingredient, IngredientQuantity} from "../../../../interfaces/ingredient.ts";
import {useGenericGet} from "../../../../services/useGenericGet.ts";
import {useInitializeIngredient} from "../ingredients/hooks/useInitializeIngredient.ts";
import {Category} from "../../../../interfaces/category.ts";
import {Button, Col, Form, Modal, Row, Table} from "react-bootstrap";
import {DeleteButton} from "../../../table/DeleteButton.tsx";

interface Props  {
    show: boolean;
    onHide: () => void;
    title:string
    pro: Product;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    modalType: ModalType;
}

export const ProductsModal = ({ show, onHide, title, pro, setRefetch, modalType }: Props) => {

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

    //Todo POST / PUT / UpdateState / setRefetch => Product

    //------------------------------------------------------------------------------------------------------------------
    const [step, setStep] = useState(0);

    //Continue Button
    const handleContinue = () => {
        if (step < 5) {
            setStep(step + 1);
        }
    };

    //Back Button
    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    //Click on Circle of Step
    const handleStepClick = (index:number) => {
        setStep(index);
    };

    //Step Titles
    const stepTitles = [
        "Datos",
        "Precio",
        "Receta",
        "Ingredientes",
        "Imagen",
    ];
    const deleteIngredient = (index: number) => {
        const newIngredients = [...selectedIngredients];
        newIngredients.splice(index, 1);
        setSelectedIngredients(newIngredients);
    };
    //------------------------------------------------------------------------------------------------------------------

    //Todo Yup, Formik


    return(
        <>
            {modalType === ModalType.ChangeStatus
                ?
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/*-----------------------------Todo pro.id to pro.name--------------------------------------*/}
                        <p>¿Está seguro que desea modificar el estado del Producto?<br/> <strong>{pro.id}</strong>?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                            Cancelar
                        </Button>
                        {/*-----------------------------Todo onClick={handleProductStatus}----------------------------*/}
                        <Button variant="danger" onClick={onHide}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
                :
                <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-xl">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    {/*------------------------------------------Stepper----------------------------------------------*/}
                    <div className="stepper-container mt-3">
                        <div className="stepper mt-2 mx-5">

                            {/*Length config*/}
                            {Array.from({ length: 5 }, (_, index) => (

                                <div key={index} className={`step${step === index ? " active" : ""}`}>
                                    <div className="step-content">
                                        <div className="step-number"
                                             onClick={() => handleStepClick(index)}
                                             onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
                                             onMouseLeave={() => { document.body.style.cursor = 'default' }}
                                        >
                                            <span>{index + 1}</span>
                                        </div>
                                        <div className="step-title">{stepTitles[index]}</div>
                                    </div>
                                </div>
                            ))}
                            <style>{`.stepper::after { width: ${(step / 4) * 100}%; }`}</style>
                        </div>
                    </div>
                    {/*-----------------------------------------------------------------------------------------------*/}
                    <Modal.Body>
                        {/*------------------------Todo <Form onSubmit={formik.handleSubmit}>-------------------------*/}
                        <Form>
                            {step == 0 && (
                                // Todo Mover este bloque <ROW> a otro STEP
                                <Row className="mt-3">
                                    <Col>
                                        <Row>
                                            <Col>
                                                {/*-------------------------Category---------------------------------*/}
                                                <Form.Group controlId="formCategory">
                                                    <Form.Label>Rubro Ingrediente:</Form.Label>
                                                    <Form.Select
                                                        name="category"
                                                        value={selectedCategory || ""}
                                                        onChange={(event) => {
                                                            const selectedId = Number(event.target.value);
                                                            setSelectedCategory(selectedId);
                                                        }}
                                                    >
                                                        {categories.map((cat) => (
                                                            <option key={cat.id} value={cat.id} disabled={cat.blocked}>
                                                                {cat.denomination}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                {/*-------------------------Ingredient-------------------------------*/}
                                                <Form.Group controlId="formIngredients">
                                                    <Form.Label>Ingrediente:</Form.Label>
                                                    <Form.Select
                                                        name="ingredients"
                                                        value={ingrediente.name}
                                                        onChange={(event) => {
                                                            const selectedId = Number(event.target.value);
                                                            const selectedIngredient = ingredients.find(ing => ing.id === selectedId) || ingrediente;
                                                            setIngrediente(selectedIngredient);
                                                        }}
                                                    >
                                                        {ingredients.filter(ing => ing.categoryId === selectedCategory).map((ing) => (
                                                            <option key={ing.id} value={ing.id} disabled={ing.blocked}>
                                                                {ing.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                {/*Quantity Ingredient*/}
                                                {/*todo Formik integer min(0)*/}
                                                <Form.Group controlId="formIngredientCant" className="mt-4">
                                                    <Form.Label>Cantidad</Form.Label>
                                                    <Form.Control
                                                        name="ingrediente.cantidad"
                                                        type="number"
                                                        value={quantity}
                                                        onChange={(event) => setQuantity(Number(event.target.value))}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                {/*Ingredient Unit Measurement*/}
                                                <Form.Group controlId="formIngredientM" className="mt-4">
                                                    <Form.Label>U.Medida</Form.Label>
                                                    <Form.Control
                                                        disabled
                                                        name="ingrediente.medida"
                                                        type="text"
                                                        value={ingrediente.measurementDenomination}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            {/*Add Ingredient to Table*/}
                                            <div className="mt-4 d-flex justify-content-center">
                                                <Button className="mt-2" onClick={() => setSelectedIngredients([...selectedIngredients, {...ingrediente, quantity}])}>
                                                    Agregar Ingrediente
                                                </Button>
                                            </div>
                                        </Row>
                                    </Col>
                                    <Col>
                                        {/*----------------------------Recipe Table-----------------------------------*/}
                                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                            <Table hover>
                                                <thead>
                                                <tr className="encabezado">
                                                    <th>Nombre</th>
                                                    <th>Cantidad</th>
                                                    <th>U. Medida</th>
                                                    <th></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {selectedIngredients.map((ing, index) => (
                                                    <tr key={index} className="tr-miniTable">
                                                        <td>{ing.name}</td>
                                                        <td>{ing.quantity}</td>
                                                        <td>{ing.measurementDenomination}</td>
                                                        <td className="justify-content-center"> <DeleteButton onClick={() => deleteIngredient(index)}/></td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Col>
                                </Row>)}
                            {step == 1 && (
                                <Row>
                                    <Col>
                                    </Col>
                                    <Col>
                                    </Col>
                                </Row>)}
                            {step == 2 && (
                                <Row>
                                    <Col>
                                    </Col>
                                    <Col>
                                    </Col>
                                </Row>)}
                            {step == 3 &&(
                                <Row>
                                    <Col>
                                    </Col>
                                    <Col>
                                    </Col>
                                </Row>
                            )}
                            {step == 4 && (
                                <Row>
                                    <Col>
                                    </Col>
                                    <Col>
                                    </Col>
                                </Row>
                            )}
                            <Modal.Footer className="mt-4">
                                {step < 4 ? (
                                    <>
                                        {step > 0 && (
                                            <Button variant="outline-primary" onClick={handleBack}>
                                                Volver
                                            </Button>
                                        )}
                                        <Button variant="primary" onClick={handleContinue}>
                                            Continuar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {step > 0 && (
                                            <Button variant="outline-primary" onClick={handleBack}>
                                                Volver
                                            </Button>
                                        )}
                                        {/*----------------Todo disabled={!formik.isValid}---------------------------*/}
                                        <Button variant="primary" type="submit">
                                            Guardar
                                        </Button>
                                    </>
                                )}
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}