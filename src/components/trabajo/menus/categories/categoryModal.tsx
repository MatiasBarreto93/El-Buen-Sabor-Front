import React, {useEffect, useState} from "react";
import {Category} from "../../../../interfaces/category";
import {ModalType} from "../../../../interfaces/ModalType";
import {useGenericGet} from "../../../../services/useGenericGet";
import {useGenericPost} from "../../../../services/useGenericPost";
import {useGenericPut} from "../../../../services/useGenericPut";
import {useGenericChangeStatus} from "../../../../services/useGenericChangeStatus";
import * as Yup from 'yup';
import {useFormik} from "formik";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";

interface Props {
    show: boolean;
    onHide: () => void;
    title:string
    cat: Category;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    modalType: ModalType;
}

export const CategoryModal = ( { show, onHide, title, cat, setRefetch, modalType }: Props) => {

    const [categories, setCategories] = useState<Category[]> ([]);

    const genericPost = useGenericPost();
    const genericPut = useGenericPut();
    const updateCategoryStatus = useGenericChangeStatus();

    const data = useGenericGet<Category>("categories", "Categorías");
    useEffect(() => {
        setCategories(data)
    }, [data]);

    const handleSaveUpdate = async(category: Category) => {
        const isNew = category.id === 0;
        console.log(JSON.stringify(category, null, 2))
        if (!isNew) {
            await genericPut<Category>("categories", category.id, category, "Categorías");
        } else {
            await genericPost<Category>("categories", "Categorías", category);
        }
        setRefetch(true);
        onHide();

    }

    const handleStateCategory = async () => {
        if(cat) {
            const id = cat.id;
            const isBlocked = !cat.blocked;

            await updateCategoryStatus(id, isBlocked, "categories", "Categoría");

            setRefetch(true);
            onHide();
        }
    }

    const validationSchema = () => {
        return Yup.object().shape({
            id: Yup.number().integer().min(0),
            denomination: Yup.string().required('La denominacion es requerida'),
            blocked: Yup.boolean(),
            categoryFatherId: Yup.number().integer().min(0).nullable(),
            categoryFatherDenomination: Yup.string().nullable(),
        });
    }

    const formik = useFormik({
        initialValues: cat,
        validationSchema: validationSchema(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Category) => handleSaveUpdate(obj)
    });

    return(
        <>
            {modalType === ModalType.ChangeStatus
                ?
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Está seguro que desea modificar el estado de la Categoría?<br/> <strong>{cat.denomination}</strong>?</p>
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
                                    <Form.Group controlId="formDenomination">
                                        <Form.Label>Denominación</Form.Label>
                                        <Form.Control
                                            name="denomination"
                                            type="text"
                                            value={formik.values.denomination || ''}
                                            onChange={formik.handleChange}
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
                                    <Form.Group>
                                        <Form.Label>Categoría Principal</Form.Label>
                                        <Form.Select
                                            name="categoryFatherId"
                                            value={formik.values.categoryFatherId || ''}
                                            onChange={(event) => {
                                                const selectedCategory = parseInt(event.target.value, 10);
                                                formik.setFieldValue(
                                                    "categoryFatherId",
                                                    isNaN(selectedCategory) ? null : selectedCategory
                                                );
                                            }}
                                            defaultValue={formik.initialValues.categoryFatherId}
                                        >
                                            <option value="">-</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.denomination}
                                                </option>
                                            ))}
                                        </Form.Select>
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
                                            defaultValue={formik.initialValues.blocked}
                                        >
                                            <option value="false">Activo</option>
                                            <option value="true">Bloqueado</option>
                                        </Form.Select>
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