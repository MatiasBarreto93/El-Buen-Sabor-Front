import {Col, Container, Row} from "react-bootstrap";
import {Producto, ProductoCard} from "./productoCard";

//DUMMY TEST
    const productosList: Producto[] = [
        {id: 1, nombre: "Producto 1", img: "/img/prod-img.png", precio: 1111},
        {id: 2, nombre: "Producto 2", img: "/img/prod-img.png", precio: 2222},
        {id: 3, nombre: "Producto 3", img: "/img/prod-img.png", precio: 2222},
        {id: 4, nombre: "Producto 4", img: "/img/prod-img.png", precio: 2222},
        {id: 5, nombre: "Producto 5", img: "/img/prod-img.png", precio: 2222},
        {id: 6, nombre: "Producto 6", img: "/img/prod-img.png", precio: 2222},
    ];

export const ProductoCardList = () =>{
    return(
        <Container>
            <Row>
                {productosList.map((p:Producto) => (
                    <Col xl={2} lg={3} md={4} sm={6} xs={12} key={p.id}>
                    <ProductoCard id={p.id} nombre={p.nombre} img={p.img} precio={p.precio}/>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}
