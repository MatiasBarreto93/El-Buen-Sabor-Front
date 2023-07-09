import {useEffect, useState} from "react";
import {Container, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
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
        <Container fluid>
            <div className="mb-5 text-center border-bottom border-3 display-3 fw-bold">Catálogo</div>
            <ToggleButtonGroup className="d-flex flex-wrap mb-4 w-60" type="radio" name={"options"} defaultValue={1}>
                {categories.map((category) => (
                    <ToggleButton
                        key={category.id}
                        id={`tbg-radio-${category.id}`}
                        value={category.id}
                        className={`toggle-button ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => handleToggle(category.id, category.denomination)}
                    >
                        {category.denomination}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <div className="mb-4 text-center border-bottom border-2 display-6 fw-bold">{activeCategoryDenomination}</div>
            <ProductoCardList/>
        </Container>
    );
};

