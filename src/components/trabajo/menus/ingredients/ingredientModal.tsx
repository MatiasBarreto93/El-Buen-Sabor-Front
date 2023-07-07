import React, {useEffect, useState} from "react";
import {ModalType} from "../../../../interfaces/ModalType";
import {Ingredient} from "../../../../interfaces/ingredient";
import {useGenericPost} from "../../../../services/useGenericPost";
import {useGenericPut} from "../../../../services/useGenericPut";
import {useGenericChangeStatus} from "../../../../services/useGenericChangeStatus";
import * as Yup from 'yup';
import {useFormik} from "formik";
import {Category} from "../../../../interfaces/category";
import {useGenericGet} from "../../../../services/useGenericGet";
import {MeasurementUnit} from "../../../../interfaces/MeasurementUnit";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";

interface Props {
    show: boolean;
    onHide: () => void;
    title:string
    ing: Ingredient;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    modalType: ModalType;
}

export const IngredientModal = ({ show, onHide, title, ing, setRefetch, modalType }: Props) => {

    const [categories, setCategories] = useState<Category[]> ([]);
    const [measurementsUnits, setMeasurementsUnits] = useState<MeasurementUnit[]>([]);

    const genericPost = useGenericPost();
    const genericPut = useGenericPut();
    const updateCategoryStatus = useGenericChangeStatus();

    const dataCategories = useGenericGet<Category>(`categories/filter/${ing.itemTypeId}`, "Categorías");
    const dataMeasurementsUnits = useGenericGet<MeasurementUnit>("measurementUnits", "Unidades de Medida");

    useEffect(() => {
        setCategories(dataCategories);
        setMeasurementsUnits(dataMeasurementsUnits)
    }, [dataCategories, dataMeasurementsUnits]);

    const handleSaveUpdate = async(ingredient: Ingredient) => {
        const isNew = ingredient.id === 0;
        if (!isNew) {
            await genericPut<Ingredient>("items", ingredient.id, ingredient, "Ingrediente Editado");
        } else {
            await genericPost<Ingredient>("items", "Ingrediente Creado", ingredient);
        }
        setRefetch(true);
        onHide();
    }

    const handleStateCategory = async () => {
        if(ing) {
            const id = ing.id;
            const isBlocked = !ing.blocked;

            await updateCategoryStatus(id, isBlocked, "items", "Ingrediente");

            setRefetch(true);
            onHide();
        }
    }

    const validationSchema = () => {
        return Yup.object().shape({
            id: Yup.number().integer().min(0),
            name: Yup.string().required('El nombre es requerido'),
            blocked: Yup.boolean(),
            categoryId: Yup.number().integer().min(0),
            categoryDenomination: Yup.string().nullable(),
            itemTypeId: Yup.number().integer().min(0),
            itemTypeDenomination: Yup.string().nullable(),
            measurementUnitId: Yup.number().integer().min(0),
            measurementDenomination: Yup.string().nullable(),
            currentStock: Yup.number().integer().min(0),
            costPrice: Yup.number().integer().min(0),
            minStock: Yup.number().integer().min(0),
            maxStock: Yup.number().integer().min(0),
        });
    }

    const formik = useFormik({
        initialValues: ing,
        validationSchema: validationSchema(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Ingredient) => handleSaveUpdate(obj)
    })

    return(
        <>
            {modalType === ModalType.ChangeStatus
                ?
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Está seguro que desea modificar el estado del Ingrediente?<br/> <strong>{ing.name}</strong>?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleStateCategory}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
                :
                <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-xl">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={formik.handleSubmit}>
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
                                            isInvalid={Boolean(formik.errors.denomination && formik.touched.denomination)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.denomination}
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
                                <Col>
                                    <Form.Group controlId="formCategoryId">
                                        <Form.Label>Rubro</Form.Label>
                                        <Form.Select
                                            name="categoryId"
                                            value={formik.values.categoryId}
                                            onChange={(event) => {
                                                formik.setFieldValue("categoryId", event.target.value);
                                            }}
                                        >
                                            <option value="">Seleccionar</option>)
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.denomination}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formMeasurementUnitId">
                                        <Form.Label>Unidad de Medida</Form.Label>
                                        <Form.Select
                                            name="measurementUnitId"
                                            value={formik.values.measurementUnitId}
                                            onChange={(event) => {
                                                formik.setFieldValue("measurementUnitId", event.target.value);
                                            }}
                                        >
                                            <option value="">Seleccionar</option>)
                                            {measurementsUnits.map((mesun) => (
                                                <option key={mesun.id} value={mesun.id}>
                                                    {mesun.denomination}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formCostPrice">
                                        <Form.Label>Costo</Form.Label>
                                        <Form.Control
                                            name="costPrice"
                                            type="number"
                                            value={formik.values.costPrice || 0}
                                            onChange={(event) => {
                                                const value = parseFloat(event.target.value);
                                                formik.setFieldValue("costPrice", isNaN(value) ? 0 : value);
                                            }}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(formik.errors.denomination && formik.touched.denomination)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.denomination}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formCurrentStock">
                                        <Form.Label>Stock Actual</Form.Label>
                                        <Form.Control
                                            name="currentStock"
                                            type="number"
                                            value={formik.values.currentStock || 0}
                                            onChange={(event) => {
                                                const value = parseFloat(event.target.value);
                                                formik.setFieldValue("currentStock", isNaN(value) ? 0 : value);
                                            }}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(formik.errors.denomination && formik.touched.denomination)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.denomination}
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
                                            onChange={(event) => {
                                                const value = parseFloat(event.target.value);
                                                formik.setFieldValue("minStock", isNaN(value) ? 0 : value);
                                            }}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(formik.errors.denomination && formik.touched.denomination)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.denomination}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formMaxStock">
                                        <Form.Label>Stock Maximo</Form.Label>
                                        <Form.Control
                                            name="minStock"
                                            type="number"
                                            value={formik.values.maxStock || 0}
                                            onChange={(event) => {
                                                const value = parseFloat(event.target.value);
                                                formik.setFieldValue("maxStock", isNaN(value) ? 0 : value);
                                            }}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(formik.errors.denomination && formik.touched.denomination)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.denomination}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Modal.Footer className="mt-4">
                                <Button variant="secondary" onClick={onHide}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" type="submit" disabled={!formik.isValid}>
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
            }
        </>
    )

}