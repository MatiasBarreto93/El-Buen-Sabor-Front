import {
    Button,
    Col,
    Form,
    Modal,
    ModalTitle,
    Row
} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useAuth0} from "@auth0/auth0-react";
import {Category} from "../../../../interfaces/category";

interface Props {
    show: boolean;
    onHide: () => void;
    title:string
    cat: Category | null;
    fetchCategories: () => void;
}

export const CategoryModal = ( { show, onHide, title, cat, fetchCategories }: Props) => {
    const { getAccessTokenSilently } = useAuth0();

    const [category, setCategory] = useState<Category | undefined>(cat? cat : {
        id: 0,
        denomination: "",
        isBanned: false,
        fatherCategory: null,
        childCategories: null,
    });

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch("http://localhost:8080/api/v1/categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data)
                    console.log(data)
                } else {
                    console.error("Error fetching data:", response.status);
                }
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log("name:", name);
        console.log("value:", value);
        setCategory((prevCategory) => {
            const updatedCategory: Category = { ...(prevCategory || {} as Category) };

            if (name === "denomination") {
                updatedCategory.denomination = value;
            } else if (name === "category.father") {
                const categoryFatherId = parseInt(value);
                updatedCategory.fatherCategory = categoryFatherId ? categories.find(category => category.id === categoryFatherId) || null : null;
            } else if (name === "category.blocked") {
                updatedCategory.isBanned = value === "true";
            }
            return updatedCategory;
        });
    };

    const handleSaveUpdate = async () => {
        const isNew = !category?.id;

        const url = isNew
            ? "http://localhost:8080/api/v1/categories"
            : `http://localhost:8080/api/v1/categories/${category?.id}`;

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(url, {
                method: isNew ? "POST" : "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(category),
            });
            if (response.ok) {
                onHide();
                await fetchCategories();
                toast.success(isNew ? "Categoría Creada" : "Categoría Actualizada", {
                    position: "top-center",
                });
            } else {
                toast.error("Ah ocurrido un error", {
                    position: "top-center",
                });
            }
        } catch (error) {
            toast.error("Ah ocurrido un error" + error, {
                position: "top-center",
            });
        }
    }

    const handleStateCategory = async () => {

        const token = await getAccessTokenSilently();

        if (category) {
            const id = category.id;
            const blocked = !category.isBanned;
            try {
                await fetch(`http://localhost:8080/api/v1/categories/${id}/block?blocked=${blocked}`, {
                    method: 'PUT',
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                await fetchCategories();
                onHide();
                toast.success(`Estado de la Categoría Actualizada`, {
                    position: "top-center",
                });
            } catch (error) {
                toast.error("Ah ocurrido un error", {
                    position: "top-center",
                });
            }
        }
    };

    const validTitles = ["Nueva Categoría", "Editar Categoría", "¿Bloquear Categoría?", "¿Desbloquear Categoría?"];
    if (!validTitles.includes(title)) {
        return (
            toast.error("Error!, la funcion requerida no existe", {
                position: "top-center"
            }))
    }

    return(
        <>
            {title.toLowerCase().includes("quear")
                ?
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <ModalTitle>{title}</ModalTitle>
                    </Modal.Header>
                    <Modal.Body>
                        <p>¿Esta seguro que desea modificar el estado de la Categoría? <br/> <strong>{category?.denomination}</strong></p>
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
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formDenomination">
                                        <Form.Label>Denominacion</Form.Label>
                                        <Form.Control
                                            name="denomination"
                                            type="text"
                                            value={category?.denomination || ''}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formCategory">
                                        <Form.Label>Categoría Padre</Form.Label>
                                        <Form.Select
                                            name="category.father"
                                            value ={category?.fatherCategory ? category.fatherCategory.id : ""}
                                            onChange={handleChange}>
                                                <option value={""}>No tiene</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.denomination}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formBanned">
                                        <Form.Label>Estado</Form.Label>
                                        <Form.Select
                                            name="category.blocked"
                                            value={category?.isBanned.toString()}
                                            onChange={handleChange}>
                                                <option value="false">Activo</option>
                                                <option value="true">Bloqueado</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSaveUpdate}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    )
}