import {useEffect, useState} from "react";
import {Button, Col, Navbar, Row} from "react-bootstrap";
import {ProductoCardList} from "./productoCardList.tsx";
import './../../styles/toggle-buttons.css'
import {useGenericGet} from "../../../services/useGenericGet.ts";
import {Category} from "../../../interfaces/category.ts";

export const Catalogo = () => {

    const [refetch, setRefetch] = useState(false)

    const [activeCategory, setActiveCategory] = useState(1);
    const [activeCategoryDenomination, setActiveCategoryDenomination] = useState("");

    const [categories, setCategories] = useState<Category[]>([]);
    const data = useGenericGet<Category>("categories/filter/2", "Categorías", refetch);
    useEffect(() => {
        if (data.length > 0) {
            setCategories(data);
            setActiveCategory(data[0].id);
            setActiveCategoryDenomination(data[0].denomination);
            setRefetch(false);
        }
    }, [data]);

    const handleToggle = (selectedValue: number, denomination:string) => {
        setActiveCategory(selectedValue);
        setActiveCategoryDenomination(denomination)
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="sticky mb-4 justify-content-center navbar-2">
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
            <div className="mb-4 text-center display-6 fw-bold" style={{borderBottom: "2px solid grey"}}>{activeCategoryDenomination}</div>
            <ProductoCardList/>
        </>
    );
};

