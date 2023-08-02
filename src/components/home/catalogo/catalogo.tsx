import React, {useEffect, useState} from "react";
import {Button, Col, Navbar, Row} from "react-bootstrap";
import './../../styles/toggle-buttons.css';
import './../../Layout/header/header.css';
import {useGenericGet} from "../../../services/useGenericGet.ts";
import {Category} from "../../../interfaces/category.ts";
import {Drink, Item, Product} from "../../../interfaces/products.ts";
import {ProductoCard} from "./productoCard.tsx";

export const Catalogo = () => {

    const [activeCategory, setActiveCategory] = useState(1);

    const [categories, setCategories] = useState<Category[]>([]);
    //TODO TRAER TYPE 3
    const dataCategories = useGenericGet<Category>("categories/filter/2", "Categorías");
    const [categoryRefs, setCategoryRefs] = useState<{[key: string]: React.RefObject<HTMLDivElement>}>({});

    const [products, setProducts] = useState<Product[]>([]);
    const dataProducts = useGenericGet<Product>("products", "Productos");

    const [drinks, setDrinks] = useState<Drink[]>([]);
    const dataDrink = useGenericGet<Drink>("drinks", "Bebidas");


    useEffect(() => {
        const onRender = async () => {
            //Get data
            setProducts(dataProducts);
            setDrinks(dataDrink);
            setCategories(dataCategories);

            //Primer boton seleccionado
            if (dataCategories.length > 0){
                setActiveCategory(dataCategories[0].id);
            }

            //Se crean los #href por categoria
            const newRefs: {[key: string]: React.RefObject<HTMLDivElement>} = {};
            dataCategories.forEach(category => {
                newRefs[category.denomination] = React.createRef();
            });
            setCategoryRefs(newRefs);
        }
        onRender();
    }, [dataCategories, dataProducts, dataDrink]);

    //Filtro los items por las categorias que no estan bloqueadas
    const unblockedCategoryIds = categories.map(category => category.id);
    const filteredProducts = products.filter(product => unblockedCategoryIds.includes(product.categoryId));
    const filteredDrinks = drinks.filter(drink => unblockedCategoryIds.includes(drink.categoryId));

    //Junto los productos con las bebidas
    const items: Item[] = [...filteredProducts, ...filteredDrinks];

    //Se arma el catalogo donde "key" es la denominacion de la categoria y el array de item[] donde estan todos los productos
    //que pertenen a esa categoria en particular
    const categorizedItems = items.reduce((acc: {[key: string]: Item[]}, curr: Item) => {

        //Extrae el nombre de la categoria del item
        const { categoryDenomination } = curr;

        //Si el nombre de la categoria es distinto lo coloca en un array de Item distinto
        if (!acc[categoryDenomination]) {
            acc[categoryDenomination] = [];
        }

        //Agrega al item si es de la misma categoria
        acc[categoryDenomination].push(curr);

        return acc;
    }, {});

    //Funcion de los botones y que se "navege" hasta el href de la categoria creada en el useEffect
    const handleToggle = (selectedValue: number, denomination:string) => {
        setActiveCategory(selectedValue);
        const sectionPosition = categoryRefs[denomination]?.current?.offsetTop;
        const navbarHeight = 200;
        if (sectionPosition) {
            window.scrollTo({ top: sectionPosition - navbarHeight, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="mb-4 justify-content-center navbar-2">
                <Row className='mt-1 gx-2 gy-3 justify-content-center'>
                    {categories.map((category) => (
                        <Col xs={'auto'} className='my-2' key={category.id}>
                            <Button
                                href={"#"+category.denomination}
                                className={`mx-3 toggle-button ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => handleToggle(category.id, category.denomination)}
                            >
                                {category.denomination}
                            </Button>
                        </Col>
                    ))}
                </Row>
            </Navbar>
            {Object.keys(categorizedItems).map((categoryDenomination) => (
                <div key={categoryDenomination} ref={categoryRefs[categoryDenomination]}>
                    <div className="mb-4 text-center display-6 fw-bold" style={{borderBottom: "2px solid grey"}}>{categoryDenomination}</div>
                    <Row className='d-flex justify-content-center'>
                    {categorizedItems[categoryDenomination].map((item: Item) => (
                        <Col xl={2} lg={3} md={4} sm={6} xs={12} key={item.id} className="d-flex justify-content-center mb-3">
                            <ProductoCard item={item}/>
                        </Col>
                    ))}
                    </Row>
                </div>
            ))}
        </>
    );
};

