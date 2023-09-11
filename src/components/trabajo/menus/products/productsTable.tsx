import {useEffect, useState} from "react";
import {useGenericGet} from "../../../../services/useGenericGet.ts";
import {Product} from "../../../../interfaces/products.ts";
import {ModalType} from "../../../../interfaces/ModalType.ts";
import {useInitializeProduct} from "./hooks/useInitializeProduct";
import {Button, Table} from "react-bootstrap";
import {EditButton} from "../../../table/EditButton";
import {StatusButton} from "../../../table/StatusButton";
import {ProductModal} from "./productModal";
import "./../../../styles/table.css"

export const ProductsTable = () => {

    const [refetch, setRefetch] = useState(false)
    const data = useGenericGet<Product>("products", "Productos", refetch);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        setProducts(data);
        setRefetch(false);
    }, [data]);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    const [title, setTitle] = useState("");

    const [newProduct, setProduct, createNewProduct] = useInitializeProduct(undefined);

    const handleClick = (newTitle: string, product: Product, modal: ModalType) => {
        setTitle(newTitle);
        setProduct(product);
        setModalType(modal)
        setShowModal(true);
    }

    return(
        <>
            <h5 className="encabezado mb-3">Productos</h5>
            <Button onClick={() => handleClick("Nuevo Producto", createNewProduct(), ModalType.Create)}>Nuevo Producto</Button>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Nombre</th>
                    <th>Rubro</th>
                    <th>Precio</th>
                    <th>Tiempo de Preparación</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.categoryDenomination}</td>
                        <td>${product.sellPrice}</td>
                        <td>{product.preparationTime} min</td>
                        <td style={{ fontWeight: 'bold', color: product.blocked ? '#D32F2F' : '#34A853' }}>{product.blocked ? 'Bloqueado' : 'Activo'}</td>
                        <td><EditButton onClick={() => {handleClick("Editar Producto", product, ModalType.Edit)}}/></td>
                        <td><StatusButton
                            isBlocked={product.blocked}
                            onClick={() => {handleClick(product.blocked ? "¿Desbloquear Producto?" : "¿Bloquear Producto?",
                                product,
                                ModalType.ChangeStatus)}}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {showModal && (
                <ProductModal
                    prod={newProduct}
                    title={title}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    setRefetch={setRefetch}
                    modalType={modalType}
                />
            )}
        </>
    )
}


