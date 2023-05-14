import React from "react";
import {Button, Card} from "react-bootstrap";

//Hay que crear una carpeta separada para las interfaces
export interface Producto{
    id: number
    nombre:string
    img:string;
    precio: number
}

export const ProductoCard:React.FC<Producto> = ({ id, nombre, img, precio }) =>{
    return(
        <Card style={{  maxWidth: "14rem" }} id={id.toString()} className="mx-auto mt-2 mb-2 p-2">
            <Card.Img variant="top" src={img} className="img-fluid"/>
            <Card.Body>
                <Card.Title>{nombre}</Card.Title>
                <Card.Text>${precio}</Card.Text>
                <Button variant="primary" className="mb-2" >Comprar</Button>
                <Button variant="secondary">Ver Detalles</Button>
            </Card.Body>
        </Card>
    )
}