import {useEffect, useState} from "react";
import {useGenericGet} from "../../../../services/useGenericGet.ts";
import {Product} from "../../../../interfaces/products.ts";
import {ModalType} from "../../../../interfaces/ModalType.ts";



export const ProductsTable = () => {

    /*Todo al igual que categorias existe un toggle para cambiar entre comidas y bebidas?????*/
    //Todo new Modal Type ???

    // Todo productInitializer customHook
    //  const [newProduct, setNewProduct, createNewProduct] = useInitializeProduct(undefined);

    const [refetch, setRefetch] = useState(false)

    const data = useGenericGet<Product>("products", "Productos", refetch);
    const [product, setProduct] = useState<Product[]>([]);
    const [selectedItemType, setSelectedItemType] = useState(1);

    useEffect(() => {
        setProducts(data);
        setRefetch(false);
    }, [data]);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    const [title, setTitle] = useState("");

    const handleClick = (newTitle: string, product: Product, modal: ModalType) => {
        setTitle(newTitle);
        setProduct(product);
        setModalType(modal)
        setShowModal(true);
    }

    // ????
    const handleToggle = (selectedValue: number) => {
        setSelectedItemType(selectedValue);
    };

    return(
        <></>
    )
}


