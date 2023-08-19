import {Order} from "../../interfaces/customer.ts";
import {Button, Modal} from "react-bootstrap";
import {useGenericPut} from "../../services/useGenericPut.ts";
import React from "react";

interface Prop{
    ord: Order;
    show: boolean;
    onHide: () => void;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CancelOrderModal = ({ord, show, onHide, setRefetch}: Prop) => {

    const genericPut = useGenericPut();

    const cancelOrder = async () => {
        const cancelledOrder = { ...ord, cancelled: true, orderStatusId: 6};
        await genericPut<Order>("orders", ord.id, cancelledOrder, "Orden Cancelada");
        setRefetch(true);
        onHide();
    }

    return(
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Cancelar Pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Está seguro que desea cancelar el pedido?<br/>
                    <strong>Cliente: {ord.customerName} {ord.customerLastname}</strong><br/>
                    <strong>Pedido: #{ord.id}</strong><br/></p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={cancelOrder}>
                    Aceptar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}