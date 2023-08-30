import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { ModalType } from "../../../../interfaces/ModalType";
import { Product } from "../../../../interfaces/products";
import { Ingredient, IngredientQuantity } from "../../../../interfaces/ingredient";
import { Category } from "../../../../interfaces/category";
import { useGenericPost } from "../../../../services/useGenericPost";
import { useGenericPut } from "../../../../services/useGenericPut";
import { useGenericChangeStatus } from "../../../../services/useGenericChangeStatus";
import { useGenericGet } from "../../../../services/useGenericGet";
import { useInitializeIngredient } from "../ingredients/hooks/useInitializeIngredient";
import { formikMultiStepProductSchema } from "./productsValidationSchema";
import { DeleteButton } from "../../../table/DeleteButton";
import "../../../styles/HorizontalStepper.css";

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

    //Categories Products HTMLSelect
    const dataCategories = useGenericGet<Category>(`categories/filter/2`, "Categorías");
    const [categories, setCategories] = useState<Category[]> ([]);

    //Categories Ingredients HTMLSelect
    const dataCategoriesIngredient = useGenericGet<Category>(`categories/filter/1`, "Categorías");
    const [categoriesIngredient, setCategoriesIngredient] = useState<Category[]> ([]);
    const [selectedCategory, setSelectedCategory] = useState(0);

    //Ingredients HTMLSelect
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const dataIngredient = useGenericGet<Ingredient>("ingredients", "Ingredientes");

    // console.log(JSON.stringify(categories, null, 2))

    //Recipe
    const [ingrediente, setIngrediente] = useInitializeIngredient(undefined);
    const [selectedIngredients, setSelectedIngredients] = useState<IngredientQuantity[]>([]);

    const [currentStock, setCurrentStock] = useState(0);

    //Fill modal form inputs fields with ingredients, categoriesIngredient
    useEffect(() =>{
        setCategories(dataCategories);
        setCategoriesIngredient(dataCategoriesIngredient);
        setIngredients(dataIngredient);
    },[dataCategories, dataCategoriesIngredient, dataIngredient])

    //Populate ingredients table on EDIT
    useEffect(() => {
        if (prod.id !== 0) {
            const fullIngredients = prod.ingredients.map(ingredient => {
                const fullIngredient = ingredients.find(i => i.id === ingredient.id);
                return {...ingredient, ...fullIngredient};
            });
            setSelectedIngredients(fullIngredients);
        }
    }, [prod, ingredients]);


    // Function to handle saving or updating a product
    const handleSaveUpdate = async(product: Product) => {
        const isNew = product.id === 0;
        const updatedProduct: Product = { ...product };
        updatedProduct.ingredients = selectedIngredients;
        updatedProduct.currentStock = currentStock;

        if (!isNew) {
            await genericPut<Product>("products", product.id, updatedProduct, "Producto Editado");
        } else {
            await genericPost<Product>("products", "Producto Creado", updatedProduct);
        }

        setRefetch(true);
        onHide();
    }

    // Function to handle changing the state of a product
    const handleStateProduct = async () => {
        if(prod) {
            const id = prod.id;
            const isBlocked = !prod.blocked;

            await updateProductStatus(id, isBlocked, "products", "Producto");

            setRefetch(true);
            onHide();
        }
    }

    // State variables for managing form steps and validation
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

    // Function to handle navigation to the next step
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

    // Function to navigate back to the previous step
    const handleBack = () => {
        if (step > 0) {
            setValidationSchema(formikMultiStepProductSchema(prod.id)[step - 1]);
            setStep(step - 1);
        }
    };

    // Function to handle clicking on a step title to navigate to that step
    const handleStepClick = (index:number) => {
        if (isValid && index <= highestValidatedStep && validatedSteps[index]){
            setValidationSchema(formikMultiStepProductSchema(prod.id)[index]);
            setStep(index);
        }
    };

    // Step titles for display
    const stepTitles = ["Datos", "Imagen", "Ingredientes"];

    // Enable/disable continue button on step change
    useEffect(() => {
        formik.validateForm().then(errors => {
            setIsValid(Object.keys(errors).length === 0);
        });
    }, [step, validationSchema]);

    // Enable continue button when inputs are valid
    useEffect(() => {
        setIsValid(Object.keys(formik.errors).length === 0);
    }, [formik.errors]);

    useEffect(() => {
        const costPrice = selectedIngredients.reduce((total, ingredient) => {
            return total + (ingredient.costPrice * ingredient.quantity); }, 0);
        formik.setFieldValue('costPrice', costPrice);

        const productStock = selectedIngredients.reduce((minimumStock, ingredient) => {
            const currentIngredientPotential = ingredient.currentStock / ingredient.quantity;
            return currentIngredientPotential < minimumStock ? currentIngredientPotential : minimumStock;
        }, Infinity);
        setCurrentStock(productStock);

    }, [selectedIngredients]);

    // Function to convert file to base64
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

    // Function to handle image upload and validation
    const handleImageUpload = async (e, setFieldValue, validateField) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setFieldValue('image', base64);
        await validateField('image');
    };

    // Function to delete an ingredient from the list
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
                                            <Form.Group controlId="formPreparationTime">
                                                <Form.Label>Tiempo:</Form.Label>
                                                <Form.Control
                                                    name="preparationTime"
                                                    type="number"
                                                    value={formik.values.preparationTime || 0}
                                                    onChange={(event) => formik.setFieldValue("preparationTime", event.target.value)}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={Boolean(formik.errors.preparationTime && formik.touched.preparationTime)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.preparationTime}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
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
                                                    <option value="">Seleccionar</option>
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
                                </Row>
                            )}
                            {step == 1 && (
                                <Row>
                                    <Col>
                                        <Form.Group controlId="formDescription">
                                            <Form.Label>Descripcion</Form.Label>
                                            <Form.Control
                                                name="description"
                                                as="textarea"
                                                value={formik.values.description || ''}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                isInvalid={Boolean(formik.errors.description && formik.touched.description)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.description}
                                            </Form.Control.Feedback>
                                        </Form.Group>
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
                                    <Col>
                                        <Form.Group controlId="formImagePreview">
                                            <Form.Label>Previsualización de la imagen :</Form.Label>
                                            {formik.values.image && <img src={formik.values.image} alt="Imagen seleccionada" style={{width: '100%', maxHeight: '300px'}} />}
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
                                                    {/*-------------------------Category Ingredients---------------------------------*/}
                                                    <Form.Group controlId="formCategoryIngredientId">
                                                        <Form.Label>Rubro Ingrediente:</Form.Label>
                                                        <Form.Select
                                                            name="categoryIngredientId"
                                                            value={formik.values.categoryIngredientId}
                                                            onChange={(event) => {
                                                                const newValue = Number(event.target.value);
                                                                formik.setFieldValue("categoryIngredientId", newValue);
                                                                setSelectedCategory(newValue);
                                                                formik.setFieldValue("ingredientId", 0);
                                                            }}
                                                            onBlur={formik.handleBlur}
                                                            isInvalid={Boolean(formik.errors.categoryIngredientId && formik.touched.categoryIngredientId)}
                                                        >
                                                            <option value="">Seleccionar</option>
                                                            {categoriesIngredient.map((cat) => (
                                                                <option key={cat.id} value={cat.id} disabled={cat.blocked}>
                                                                    {cat.denomination}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                        <Form.Control.Feedback type="invalid">
                                                            {formik.errors.categoryIngredientId}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    {/*-------------------------Ingredient-------------------------------*/}
                                                    <Form.Group controlId="formIngredientId">
                                                        <Form.Label>Ingrediente:</Form.Label>
                                                        <Form.Select
                                                            name="ingredientId"
                                                            value={formik.values.ingredientId}
                                                            onChange={(event) => {
                                                                const newValue = Number(event.target.value);
                                                                formik.setFieldValue("ingredientId", newValue);
                                                                const selectedIngredient = ingredients.find(ing => ing.id === newValue) || ingrediente;
                                                                setIngrediente(selectedIngredient);
                                                                formik.setFieldValue("ingredientQuantity", 0);
                                                            }}
                                                            onBlur={formik.handleBlur}
                                                            isInvalid={Boolean(formik.errors.ingredientId && formik.touched.ingredientId)}
                                                        >
                                                            <option value="">Seleccionar</option>
                                                            {ingredients.filter(ing => ing.categoryId === selectedCategory).map((ing) => (
                                                                <option key={ing.id} value={ing.id} disabled={ing.blocked}>
                                                                    {ing.name}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                        <Form.Control.Feedback type="invalid">
                                                            {formik.errors.ingredientId}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    {/*Quantity Ingredient*/}
                                                    <Form.Group controlId="formIngredientQuantity" className="mt-4">
                                                        <Form.Label>Cantidad</Form.Label>
                                                        <Form.Control
                                                            name="ingredientQuantity"
                                                            type="number"
                                                            value={formik.values.ingredientQuantity || 0}
                                                            onChange={(event) => formik.setFieldValue("ingredientQuantity", event.target.value)}
                                                            onBlur={formik.handleBlur}
                                                            isInvalid={Boolean(formik.errors.ingredientQuantity && formik.touched.ingredientQuantity)}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {formik.errors.ingredientQuantity}
                                                        </Form.Control.Feedback>
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
                                                    <Button className="mt-2"
                                                            disabled={
                                                                formik.errors.categoryIngredientId ||
                                                                formik.errors.ingredientId ||
                                                                formik.errors.ingredientQuantity
                                                            }
                                                            onClick={() => {
                                                                const newIngredients = [...selectedIngredients, {...ingrediente, quantity: formik.values.ingredientQuantity}];
                                                                setSelectedIngredients(newIngredients);
                                                            }}
                                                    >
                                                        Agregar Ingrediente
                                                    </Button>
                                                </div>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Form.Group controlId="formCostPrice" className="mt-4">
                                                        <Form.Label>Costo Producto</Form.Label>
                                                        <Form.Control
                                                            disabled
                                                            name="costPrice"
                                                            type="number"
                                                            value={formik.values.costPrice || 0}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group controlId="formSellPrice" className="mt-4">
                                                        <Form.Label>Precio de venta:</Form.Label>
                                                        <Form.Control
                                                            name="sellPrice"
                                                            type="number"
                                                            value={formik.values.sellPrice || 0}
                                                            onChange={(event) => formik.setFieldValue("sellPrice", event.target.value)}
                                                            onBlur={formik.handleBlur}
                                                            isInvalid={Boolean(formik.errors.sellPrice && formik.touched.sellPrice)}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {formik.errors.sellPrice}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
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