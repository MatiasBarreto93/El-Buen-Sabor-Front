import {Ingredient} from "../../../../interfaces/ingredient.ts";
import {Drink} from "../../../../interfaces/products.ts";
import React, {useEffect, useState} from "react";
import {useGenericPut} from "../../../../services/useGenericPut.ts";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {useFormik} from "formik";
import * as Yup from "yup";
import secureLS from "../../../../util/secureLS.ts";

interface Props {
    show: boolean;
    onHide: () => void;
    setRefetchIngredient: React.Dispatch<React.SetStateAction<boolean>>;
    setRefetchDrink: React.Dispatch<React.SetStateAction<boolean>>;
    item: Ingredient | Drink;
    title: string;
}

export const StockModal = ({show, onHide, setRefetchIngredient, setRefetchDrink, item, title}:Props) => {

    const genericPut = useGenericPut();
    const [isIngredient, setIsIngredient] = useState(true)
    const [maxPossibleInput, setMaxPossibleInput] = useState(0)
    const [itemCurrentStock, setItemCurrentStock] = useState(0);

    useEffect(() => {
        if ("image" in item){
            setIsIngredient(false);
        }
        setMaxPossibleInput((item.maxStock - item.currentStock))
        setItemCurrentStock(item.currentStock)
    }, [item]);

    const handleSaveUpdate = async(itm: Ingredient | Drink) => {
        itm = {...itm, currentStock: itm.currentStock + itemCurrentStock}
        if (isIngredient){
            await genericPut<Ingredient>("ingredients", itm.id, itm, `Compra de ${itm.name} Realizada`);
            secureLS.remove("ingredients")
            setRefetchIngredient(true);
        } else {
            await genericPut<Drink>("drinks", itm.id, itm, `Compra de ${itm.name} Realizada`);
            secureLS.remove("drinks")
            setRefetchDrink(true);
        }
        onHide();
    }

    const validationSchema = () => {
        return Yup.object().shape({
            costPrice: Yup.number().integer("Ingrese un numero Entero").min(1, "El numero no puede ser 0").required("Ingrese un numero valido"),
            currentStock: Yup.number().integer("Ingrese un numero Entero").min(1, "El numero no puede ser 0").max(maxPossibleInput, `El numero no puede superar el Stock Maximo (${maxPossibleInput})`).required("Ingrese una cantidad valida"),
        });
    }

    const formik = useFormik({
        initialValues: {...item, currentStock:0},
        validationSchema: validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        validateOnMount: true,
        onSubmit: (obj: Ingredient | Drink) => handleSaveUpdate(obj)
    })

    return(
        <Modal size={"lg"} show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Row className="mt-3">
                        <Col>
                            <Form.Group controlId="formCurrentStockItem">
                                <Form.Label>Stock Actual</Form.Label>
                                <Form.Control
                                    disabled={true}
                                    type="text"
                                    name="item.currentStock"
                                    value={item.currentStock}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formMinStock">
                                <Form.Label>Stock Minimo</Form.Label>
                                <Form.Control
                                    disabled={true}
                                    name="minStock"
                                    type="text"
                                    value={formik.values.minStock || ''}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formMaxStock">
                                <Form.Label>Stock Maximo</Form.Label>
                                <Form.Control
                                    disabled={true}
                                    name="maxStock"
                                    type="text"
                                    value={formik.values.maxStock || ''}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Form.Group controlId="formCostPrice">
                                <Form.Label>Costo</Form.Label>
                                <Form.Control
                                    name="costPrice"
                                    type="number"
                                    min={0}
                                    value={formik.values.costPrice || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={Boolean(formik.errors.costPrice && formik.touched.costPrice)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.costPrice}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formCurrentStock">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    name="currentStock"
                                    type="number"
                                    min={0}
                                    max={maxPossibleInput}
                                    value={formik.values.currentStock}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={Boolean(formik.errors.currentStock && formik.touched.currentStock)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.currentStock}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        {isIngredient && (
                            <Col>
                                <Form.Group controlId="formMeasurement">
                                    <Form.Label>U. Medida</Form.Label>
                                    <Form.Control
                                        disabled={true}
                                        name="measurementDenomination"
                                        type="text"
                                        value={formik.values.measurementDenomination || ''}
                                    />
                                </Form.Group>
                            </Col>
                        )}
                    </Row>
                    <Row className="mt-3">
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
    )
}