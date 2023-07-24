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
import {Button, Col, Form, Modal, Row, Table} from "react-bootstrap";
import {formikMultiStepTestSchema} from "../testModal/formikMultiStepTestSchema";
import {formikMultiStepProductSchema} from "./productsValidationSchema";
import {useFormik} from "formik";
import '../../../styles/HorizontalStepper.css';
import {DeleteButton} from "../../../table/DeleteButton";

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

    const dataCategories = useGenericGet<Category>(`categories/filter/2`, "Categorías");
    const [categories, setCategories] = useState<Category[]> ([]);

    //Ingredients HTMLSelect
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const dataIngredient = useGenericGet<Ingredient>("ingredients", "Ingredientes");

    //Recipe
    const [ingrediente, setIngrediente] = useInitializeIngredient(undefined);
    const [selectedIngredients, setSelectedIngredients] = useState<IngredientQuantity[]>([]);
    const [quantity, setQuantity] = useState(0);

    //Categories HTMLSelect
    const dataCategoriesIngredient = useGenericGet<Category>(`categories/filter/1`, "Categorías");
    const [categoriesIngredient, setCategoriesIngredient] = useState<Category[]> ([]);
    const [selectedCategory, setSelectedCategory] = useState(0);

    //Fill modal form inputs fields with ingredients & categoriesIngredient
    useEffect(() =>{
        setIngredients(dataIngredient)
        setCategories(dataCategories);
        setCategoriesIngredient(dataCategoriesIngredient);
    },[dataIngredient, dataCategories, dataCategoriesIngredient])

    const handleSaveUpdate = async(product: Product) => {
        const isNew = product.id === 0;

        const updatedProduct: Product = { ...product };

        updatedProduct.ingredients = selectedIngredients;

        console.log(updatedProduct);

        if (!isNew) {
            await genericPut<Ingredient>("products", product.id, updatedProduct, "Producto Editado");
        } else {
            await genericPost<Ingredient>("products", "Producto Creado", updatedProduct);
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

    const [validationSchema, setValidationSchema] = useState(formikMultiStepProductSchema(prod.id)[0]);
    const [isValid, setIsValid] = useState(false);

    const [highestValidatedStep, setHighestValidatedStep] = useState(0);
    const [validatedSteps, setValidatedSteps] = useState([false, false, false]);

    const formik = useFormik({
        initialValues: prod,
        validationSchema: validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        isInitialValid: false,
        onSubmit: (obj: Product) => handleSaveUpdate(obj)
    });

    const handleContinue = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (step < 3) {
            setValidationSchema(formikMultiStepProductSchema(prod.id)[step + 1]);
            setStep(step + 1);
            if (step + 1 > highestValidatedStep) {
                setHighestValidatedStep(step + 1);
                setValidatedSteps(validatedSteps.map((validated, index) => index <= step + 1 ? true : validated));
            }
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setValidationSchema(formikMultiStepTestSchema(prod.id)[step - 1]);
            setStep(step - 1);
        }
    };

    const handleStepClick = (index:number) => {
        if (isValid && index <= highestValidatedStep && validatedSteps[index]){
            setValidationSchema(formikMultiStepTestSchema(prod.id)[index]);
            setStep(index);
        }
    };

    const stepTitles = [
        "Nombre",
        "Imagen",
        "Ingredientes",
    ];

    //Hace que el boton "continuar" este como disabled al renderizar el modal y Desabilita el boton de continuar en cada step
    useEffect(() => {
        formik.validateForm().then(errors => {
            setIsValid(Object.keys(errors).length === 0);
        });
    }, [step, validationSchema]);

    //Habilita el boton de continuar cuando los inputs sean validos
    useEffect(() => {
        setIsValid(Object.keys(formik.errors).length === 0);
    }, [formik.errors]);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleImageUpload = async (e, setFieldValue, validateField) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        console.log(base64);
        setFieldValue('image', base64);
        await validateField('image');
    };

    const deleteIngredient = (index: number) => {
        const newIngredients = [...selectedIngredients];
        newIngredients.splice(index, 1);
        setSelectedIngredients(newIngredients);
    };

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
                    <div className="stepper-container mt-3">
                        <div className="stepper mt-2 mx-5">
                            {Array.from({ length: 3 }, (_, index) => (
                                <div key={index} className={`step${step === index ? " active" : ""}${!validatedSteps[index] ? " disabled" : ""}`}>
                                    <div className="step-content">
                                        <div className="step-number"
                                             onClick={() => handleStepClick(index)}
                                             onMouseEnter={() => { document.body.style.cursor = isValid ? 'pointer' : 'default' }}
                                             onMouseLeave={() => { document.body.style.cursor = 'default' }}
                                        >
                                            <span>{index + 1}</span>
                                        </div>
                                        <div className="step-title">{stepTitles[index]}</div>
                                    </div>
                                </div>
                            ))}
                            <style>{`.stepper::after { width: ${(step / 2) * 100}%; }`}</style>
                        </div>
                    </div>
                    <Modal.Body>
                        <Form onSubmit={formik.handleSubmit}>
                            {step == 0 && (
                                <Row>
                                    <Col>
                                        <Form.Group controlId="formName">
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                name="name"
                                                type="text"
                                                value={formik.values.name || ''}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                isInvalid={Boolean(formik.errors.name && formik.touched.name)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="formCategoryId">
                                            <Form.Label>Rubro</Form.Label>
                                            <Form.Select
                                                name="categoryId"
                                                value={formik.values.categoryId}
                                                onChange={(event) => {
                                                    formik.setFieldValue("categoryId", Number(event.target.value));
                                                }}
                                                onBlur={formik.handleBlur}
                                                isInvalid={Boolean(formik.errors.categoryId && formik.touched.categoryId)}
                                            >
                                                <option value="">Seleccionar</option>)
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.denomination}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.categoryId}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="formBlocked">
                                            <Form.Label>Estado</Form.Label>
                                            <Form.Select
                                                name="blocked"
                                                value={formik.values.blocked.toString()}
                                                onChange={(event) => {
                                                    formik.setFieldValue("blocked", event.target.value === "true");
                                                }}
                                            >
                                                <option value="false">Activo</option>
                                                <option value="true">Bloqueado</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                            {step == 1 && (
                                <Row>
                                    <Col>
                                        <Form.Group controlId="formDescription">
                                            <Form.Label>Descripcion</Form.Label>
                                            <Form.Control
                                                name="description"
                                                type="text"
                                                value={formik.values.description || ''}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                isInvalid={Boolean(formik.errors.description && formik.touched.description)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.description}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="formImage">
                                            <Form.Label>Seleccionar imagen</Form.Label>
                                            <Form.Control
                                                name="image"
                                                type="file"
                                                onChange={(e) => handleImageUpload(e, formik.setFieldValue, formik.validateField)}
                                                onBlur={formik.handleBlur}
                                                isInvalid={Boolean(formik.errors.image && formik.touched.image)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.image}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                            {step == 2 && (
                                <Row>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="formRecipeDescription">
                                                <Form.Label>Receta:</Form.Label>
                                                <Form.Control
                                                    name="recipeDescription"
                                                    as="textarea"
                                                    value={formik.values.recipeDescription || ''}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={Boolean(formik.errors.recipeDescription && formik.touched.recipeDescription)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.recipeDescription}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Row>
                                                <Col>
                                                    {/*-------------------------Category---------------------------------*/}
                                                    <Form.Group controlId="formCategory">
                                                        <Form.Label>Rubro Ingrediente:</Form.Label>
                                                        <Form.Select
                                                            name="category"
                                                            value={selectedCategory}
                                                            onChange={(event) => {
                                                                const selectedId = Number(event.target.value);
                                                                setSelectedCategory(selectedId);
                                                            }}
                                                        >
                                                            {categoriesIngredient.map((cat) => (
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
                                                            name="ingredient"
                                                            value={ingrediente.id}
                                                            onChange={(event) => {
                                                                const selectedId = Number(event.target.value);
                                                                const selectedIngredient = ingredients.find(ing => ing.id === selectedId) || ingrediente;
                                                                setIngrediente(selectedIngredient);
                                                            }}
                                                        >
                                                            <option value="">Seleccionar</option>)
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
                                                            name="ingrediente.measurementDenomination"
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
                                    </Row>
                                </Row>
                            )}
                            <Modal.Footer className="mt-4">
                                {step < 2 ? (
                                    <>
                                        {step > 0 && (
                                            <Button variant="outline-primary" type="button" onClick={handleBack}>
                                                Volver
                                            </Button>
                                        )}
                                        <Button variant="primary" type="button" onClick={(event) => handleContinue(event)} disabled={!isValid}>
                                            Continuar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {step > 0 && (
                                            <Button variant="outline-primary" type="button" onClick={handleBack}>
                                                Volver
                                            </Button>
                                        )}
                                        <Button variant="primary" type="submit" disabled={!formik.isValid}>
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