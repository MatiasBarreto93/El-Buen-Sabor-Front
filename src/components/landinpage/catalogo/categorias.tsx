import { useState } from "react";
import { Button, Container} from "react-bootstrap";
import {ProductoCardList} from "./productoCardList";

//FALTA PASAR COMO PARAMETRO EL NOMBRE DE LAS CATEGORIAS AL RENDERIZAR LAS CARDS
//Separar CATEGORIAS y hacer otro componente llamado CATALOGO?
export const Categorias = () => {
     const [activeCategory, setActiveCategory] = useState("burgers");

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
    };

    return (
        <Container fluid>
            <div className="mb-4 text-center border-bottom border-3 display-4 fw-bold">Catálogo</div>
        <div className="w-100">
                <div className="d-flex justify-content-evenly align-items-center mb-2 mt-2 mx-3 flex-wrap">
                <Button
                    className="my-2"
                    variant={activeCategory === "burgers" ? "primary" : "outline-primary"}
                    onClick={() => handleCategoryChange("burgers")}
                >
                    Burgers
                </Button>
                <Button
                    className="my-2"
                    variant={activeCategory === "lomos" ? "primary" : "outline-primary"}
                    onClick={() => handleCategoryChange("lomos")}
                >
                    Lomos
                </Button>
                <Button
                    className="my-2"
                    variant={activeCategory === "pizzas" ? "primary" : "outline-primary"}
                    onClick={() => handleCategoryChange("pizzas")}
                >
                    Pizzas
                </Button>
                <Button
                    className="my-2"
                    variant={activeCategory === "papas" ? "primary" : "outline-primary"}
                    onClick={() => handleCategoryChange("papas")}
                >
                    Papas
                </Button>
                <Button
                    className="my-2"
                    variant={activeCategory === "bebidas" ? "primary" : "outline-primary"}
                    onClick={() => handleCategoryChange("bebidas")}
                >
                    Bebidas
                </Button>
            </div>
        </div>
        {/*ACA VAN EL GRID CARD PARA LOS PRODUCTOS, HAY QUE PASAR UN PARAMETRO , CREO*/}
            <ProductoCardList/>
        </Container>
    );
};

//Codigo Categorias para despues segun GPT
//
// import React, { useState, useEffect } from "react";
// import { Tabs, Tab, Button, Container } from "react-bootstrap";
//
// export const Catalogo = () => {
//     const [activeCategory, setActiveCategory] = useState("burgers");
//     const [categories, setCategories] = useState([]);
//
//     useEffect(() => {
//         fetch("http://localhost:3001/api/categories")
//             .then((response) => response.json())
//             .then((data) => setCategories(data))
//             .catch((error) => console.error(error));
//     }, []);
//
//     const handleCategoryChange = (category) => {
//         setActiveCategory(category);
//     };
//
//     return (
//         <Container fluid>
//             <div className="mb-4 text-center border-bottom border-3 display-4 fw-bold">
//                 Catálogo
//             </div>
//             <div className="w-100">
//                 <div className="d-flex justify-content-evenly align-items-center mb-2 mt-2 mx-3 flex-wrap">
//                     {categories.map((category) => (
//                         <Button
//                             key={category}
//                             className="my-2"
//                             variant={
//                                 activeCategory === category ? "primary" : "outline-primary"
//                             }
//                             onClick={() => handleCategoryChange(category)}
//                         >
//                             {category}
//                         </Button>
//                     ))}
//                 </div>
//             </div>
//             <div className="mb-4 mt-4 border-bottom border-3 display-6 fw-bold">
//                 {activeCategory}
//             </div>
//         </Container>
//     );
// };

