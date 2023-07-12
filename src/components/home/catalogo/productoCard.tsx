import React from "react";
import {Button, Card} from "react-bootstrap";
import './../../styles/productCard.css'

export interface Producto{
    id: number
    nombre:string
    img:string;
    precio: number
}

export const ProductoCard:React.FC<Producto> = ({ id, nombre, img, precio }) =>{
    return(
        <div className="mb-3">
        <Card style={{  maxWidth: "14rem", background:"#FFFFFFFF"}}  id={id.toString()} className="custom-card">
            <Card.Img variant="top" src={img} className="img-card" />
            <Card.Body>
                <Card.Title>{nombre}</Card.Title>
                <Card.Text>${precio}</Card.Text>
            </Card.Body>
            <Card.Footer className="d-grid bg-transparent border-top-0">
                <Button variant="primary" className="btn-card mb-2">Agregar</Button>
            </Card.Footer>
        </Card>
        </div>
    )
}