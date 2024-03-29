import React, {useEffect, useState} from "react";
import {Category} from "../../../../interfaces/category";
import {ModalType} from "../../../../interfaces/ModalType";
import {useGenericPost} from "../../../../services/useGenericPost";
import {useGenericPut} from "../../../../services/useGenericPut";
import {useGenericChangeStatus} from "../../../../services/useGenericChangeStatus";
import * as Yup from 'yup';
import {useFormik} from "formik";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useGenericCacheGet} from "../../../../services/useGenericCacheGet.ts";
import secureLS from "../../../../util/secureLS.ts";

interface Props {
    show: boolean;
    onHide: () => void;
    title:string
    cat: Category;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    modalType: ModalType;
    initialItemTypeId: number;
}

export const CategoryModal = ( { show, onHide, title, cat, setRefetch, modalType, initialItemTypeId }: Props) => {

    const [categories, setCategories] = useState<Category[]> ([]);
    const genericPost = useGenericPost();
    const genericPut = useGenericPut();
    const updateCategoryStatus = useGenericChangeStatus();

    const {data} = useGenericCacheGet<Category>("categories/filter", "Categorías");

    const handleSaveUpdate = async(category: Category) => {
        const isNew = category.id === 0;
        if (!isNew) {
            await genericPut<Category>("categories", category.id, category, "Categoría Editada");
        } else {
            await genericPost<Category>("categories", "Categoría Creada", category);
        }
        secureLS.remove("categories/filter/1")
        secureLS.remove("categories/filter")
        secureLS.remove("categories")
        setRefetch(true);
        onHide();
    }

    const handleStateCategory = async () => {
        if(cat) {
            const id = cat.id;
            const isBlocked = !cat.blocked;

            await updateCategoryStatus(id, isBlocked, "categories", "Categoría");

            secureLS.remove("categories/filter/1")
            secureLS.remove("categories/filter")
            secureLS.remove("categories")
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
            itemTypeId: Yup.number().oneOf([1, 2, 3]).required('El tipo de item es requerido'),
        });
    }

    const handleCategoryFatherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = parseInt(event.target.value, 10);
        formik.setFieldValue(
            'categoryFatherId',
            isNaN(selectedCategory) ? null : selectedCategory
        );
    };

    const formik = useFormik({
        initialValues: {
            ...cat,
            itemTypeId: initialItemTypeId
        },
        validationSchema: validationSchema(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Category) => handleSaveUpdate(obj)
    });


    useEffect(() => {
        const onRender = async () => {
            if (data) {
                await filterCategories(formik.values.itemTypeId || 1);
            }
        }
        onRender();
    }, [data, formik.values.itemTypeId]);

    const filterCategories = async (itemTypeId: number) => {
        const filteredCategories = data.filter(
            (category) => category.itemTypeId === itemTypeId
        );
        setCategories(filteredCategories);
    };

    const handleItemTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedItemType = parseInt(event.target.value);
        formik.setFieldValue("itemTypeId", selectedItemType);
        filterCategories(selectedItemType);
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
                                <Col>
                                    <Form.Group controlId="formItemType">
                                        <Form.Label>Tipo de Item</Form.Label>
                                        <Form.Select
                                            name="itemTypeId"
                                            value={formik.values.itemTypeId}
                                            onChange={(event) => {
                                                formik.handleChange(event);
                                                handleItemTypeChange(event);
                                            }}
                                            onBlur={formik.handleBlur}
                                            isInvalid={Boolean(formik.touched.itemTypeId && formik.errors.itemTypeId)}
                                        >
                                            <option value={1}>Ingrediente</option>
                                            <option value={2}>Producto</option>
                                            <option value={3}>Bebida</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.itemTypeId}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formCategoryFatherId">
                                        <Form.Label>Categoría Padre</Form.Label>
                                        <Form.Select
                                            name="categoryFatherId"
                                            value={formik.values.categoryFatherId || ''}
                                            onChange={handleCategoryFatherChange}
                                            isInvalid={Boolean(formik.touched.categoryFatherId && formik.errors.categoryFatherId)}
                                        >
                                            <option value="">Seleccionar</option>
                                            {categories.map((category) => (
                                                category.id !== cat.id &&(
                                                <option key={category.id} value={category.id} disabled={category.blocked}>
                                                    {category.denomination}
                                                </option>
                                                )
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.categoryFatherId}
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