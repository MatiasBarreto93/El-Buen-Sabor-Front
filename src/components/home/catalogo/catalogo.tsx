import React, {useEffect, useState} from "react";
import {Button, Col, Navbar, Row} from "react-bootstrap";
import './../../styles/toggle-buttons.css';
import './../../Layout/header/header.css';
import {Category} from "../../../interfaces/category.ts";
import {Drink, Item, Product} from "../../../interfaces/products.ts";
import {ProductoCard} from "./productoCard.tsx";

type CategoryTree = {
    id: number;
    denomination: string;
    itemTypeId: number;
    items: Item[];
    childCategories: CategoryTree[];
};

export const Catalogo = () => {
    const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);

    const [categoryRefs, setCategoryRefs] = useState<{[key: string]: React.RefObject<HTMLDivElement>}>({});
    const [activeCategory, setActiveCategory] = useState(1);

    useEffect(() => {
        const onRender = async () => {

            const url: string = import.meta.env.VITE_BACKEND_API_URL || "";

            //Products
            const responseProducts = await fetch(`${url}products`);
            const dataProducts:Product[] = await responseProducts.json();

            //Drinks
            const responseDrinks = await fetch(`${url}drinks`);
            const dataDrink:Drink[] = await responseDrinks.json();

            //Categories
            const responseCategories = await fetch(`${url}categories/filter/ingredients`);
            const dataCategories: Category[] = await responseCategories.json();

            //Get only father categories
            const parentCategories = dataCategories.filter(category => category.categoryFatherId === null);
            //Sort to render food firsts
            parentCategories.sort((a, b) => a.itemTypeId - b.itemTypeId);

            //Filter products and drinks where the item is not blocked
            const unblockedCategoryIds = dataCategories.map(category => category.id);
            const filteredProducts = dataProducts.filter(product => unblockedCategoryIds.includes(product.categoryId) && !product.blocked);
            const filteredDrinks = dataDrink.filter(drink => unblockedCategoryIds.includes(drink.categoryId) && !drink.blocked);

            //Products + Drinks
            const items: Item[] = [...filteredProducts, ...filteredDrinks];

            // Create category tree
            const categoryTree: CategoryTree[] = parentCategories.map(category => ({
                id: category.id,
                denomination: category.denomination,
                itemTypeId: category.itemTypeId,
                items: [],
                childCategories: [],
            }));

            // Fill the items array of each category in categoryTree with items that belong to it
            categoryTree.forEach(category => {
                category.items = items.filter(item => item.categoryId === category.id);
            });

            // Fill the childCategories array of each category in categoryTree with its child categories
            categoryTree.forEach(category => {
                const childCategories = dataCategories.filter(cat => cat.categoryFatherId === category.id);
                category.childCategories = childCategories.map(childCategory => ({
                    id: childCategory.id,
                    denomination: childCategory.denomination,
                    itemTypeId: childCategory.itemTypeId,
                    items: items.filter(item => item.categoryId === childCategory.id),
                    childCategories: []  // this will be empty initially, but can be filled recursively if the child category has its own child categories
                }));
            });

            setCategoryTree(categoryTree);

            //Firsts button selected on navbar
            if (dataCategories.length > 0){
                setActiveCategory(dataCategories[0].id);
            }

            //Create #href by category
            const newRefs: {[key: string]: React.RefObject<HTMLDivElement>} = {};
            parentCategories.forEach(category => {
                newRefs[category.denomination] = React.createRef();
            });
            setCategoryRefs(newRefs);
        }
        onRender();
    }, []);

    //#href function and animation on click
    const handleToggle = (selectedValue: number, denomination:string) => {
        setActiveCategory(selectedValue);
        const sectionPosition = categoryRefs[denomination]?.current?.offsetTop;
        const navbarHeight = 200;
        if (sectionPosition) {
            window.scrollTo({ top: sectionPosition - navbarHeight, behavior: 'smooth' });
        }
    };

    function renderCatalog(category: CategoryTree) {
        return (
            <div key={category.denomination} ref={categoryRefs[category.denomination]}>
                <div className="mb-4 text-center display-6 fw-bold" style={{borderBottom: "2px solid grey"}}>{category.denomination}</div>
                <Row className='d-flex justify-content-center'>
                    {category.items.map((item: Item) => (
                        <Col xl={2} lg={3} md={4} sm={6} xs={12} key={item.id} className="d-flex justify-content-center mb-3">
                            <ProductoCard item={item}/>
                        </Col>
                    ))}
                </Row>
                {category.childCategories.map(childCategory => renderCatalog(childCategory))}
            </div>
        );
    }

    return (
        <>
            <Navbar bg="light" expand="lg" className="mb-4 justify-content-center navbar-2">
                <Row className='mt-1 gx-2 gy-3 justify-content-center'>
                    {categoryTree.map((category) => (
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
            {categoryTree.map(category => renderCatalog(category))}
        </>
    );
};

