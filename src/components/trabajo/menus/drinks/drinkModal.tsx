import {Drink} from "../../../../interfaces/products";
import React, {useEffect, useState} from "react";
import {ModalType} from "../../../../interfaces/ModalType";
import {useGenericPost} from "../../../../services/useGenericPost";
import {useGenericPut} from "../../../../services/useGenericPut";
import {useGenericChangeStatus} from "../../../../services/useGenericChangeStatus";
import {useGenericGet} from "../../../../services/useGenericGet";
import {Category} from "../../../../interfaces/category";
import {useFormik} from "formik";
import {formikMultiStepDrinkSchema} from "./drinksValidationSchema";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";

interface Props  {
    show: boolean;
    onHide: () => void;
    title:string
    dr: Drink;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    modalType: ModalType;
}

export const DrinkModal = ({show, onHide, title, dr, setRefetch, modalType}: Props) => {

    //Customs Hooks Generics
    const genericPost = useGenericPost();
    const genericPut = useGenericPut();
    const updateProductStatus = useGenericChangeStatus();

    //Categories Products HTMLSelect
    const dataCategories = useGenericGet<Category>(`categories/filter/3`, "Categorías");
    const [categories, setCategories] = useState<Category[]> ([]);

    useEffect(() =>{
        setCategories(dataCategories);
    },[dataCategories])

    // Function to handle saving or updating a product
    const handleSaveUpdate = async(drink: Drink) => {
        const isNew = drink.id === 0;
        console.log(drink)
        if (!isNew) {
            await genericPut<Drink>("drinks", drink.id, drink, "Bebida Editada");
        } else {
            await genericPost<Drink>("drinks", "Bebida Creada", drink);
        }

        setRefetch(true);
        onHide();
    }

    // Function to handle changing the state of a product
    const handleStateProduct = async () => {
        if(dr) {
            const id = dr.id;
            const isBlocked = !dr.blocked;

            await updateProductStatus(id, isBlocked, "drinks", "Bebida");

            setRefetch(true);
            onHide();
        }
    }

    // State variables for managing form steps and validation
    const [step, setStep] = useState(0);
    const [validationSchema, setValidationSchema] = useState(formikMultiStepDrinkSchema(dr.id)[0]);
    const [isValid, setIsValid] = useState(false);
    const [highestValidatedStep, setHighestValidatedStep] = useState(0);
    const [validatedSteps, setValidatedSteps] = useState([false, false, false]);
    const formik = useFormik({
        initialValues: dr,
        validationSchema: validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        isInitialValid: false,
        onSubmit: (obj: Drink) => handleSaveUpdate(obj)
    });

    // Function to handle navigation to the next step
    const handleContinue = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (step < 3) {
            setValidationSchema(formikMultiStepDrinkSchema(dr.id)[step + 1]);
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
            setValidationSchema(formikMultiStepDrinkSchema(dr.id)[step - 1]);
            setStep(step - 1);
        }
    };

    // Function to handle clicking on a step title to navigate to that step
    const handleStepClick = (index:number) => {
        if (isValid && index <= highestValidatedStep && validatedSteps[index]){
            setValidationSchema(formikMultiStepDrinkSchema(dr.id)[index]);
            setStep(index);
        }
    };

    // Step titles for display
    const stepTitles = ["Datos", "Imagen", "Precio"];

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

    return(
        <>
            {modalType === ModalType.ChangeStatus
                ?
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Está seguro que desea modificar el estado del Producto?<br/> <strong>{dr.name}</strong>?</p>
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
                                            <Form.Group controlId="formCurrentStock">
                                                <Form.Label>Stock Actual</Form.Label>
                                                <Form.Control
                                                    name="currentStock"
                                                    type="number"
                                                    value={formik.values.currentStock || 0}
                                                    onChange={(event) => formik.setFieldValue("currentStock", event.target.value)}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={Boolean(formik.errors.currentStock && formik.touched.currentStock)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.currentStock}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formMinStock">
                                                <Form.Label>Stock Minimo</Form.Label>
                                                <Form.Control
                                                    name="minStock"
                                                    type="number"
                                                    value={formik.values.minStock || 0}
                                                    onChange={(event) => formik.setFieldValue("minStock", event.target.value)}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={Boolean(formik.errors.minStock && formik.touched.minStock)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.minStock}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="formMaxStock">
                                                <Form.Label>Stock Maximo</Form.Label>
                                                <Form.Control
                                                    name="maxStock"
                                                    type="number"
                                                    value={formik.values.maxStock || 0}
                                                    onChange={(event) => formik.setFieldValue("maxStock", event.target.value)}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={Boolean(formik.errors.maxStock && formik.touched.maxStock)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.maxStock}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="formCostPrice" className="mt-4">
                                                <Form.Label>Costo Bebida:</Form.Label>
                                                <Form.Control
                                                    name="costPrice"
                                                    type="number"
                                                    value={formik.values.costPrice || 0}
                                                    onChange={(event) => formik.setFieldValue("costPrice", event.target.value)}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={Boolean(formik.errors.costPrice && formik.touched.costPrice)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.costPrice}
                                                </Form.Control.Feedback>
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