import {Button, Modal} from "react-bootstrap";
import {useCart} from "../../../context/cart/CartContext.tsx";
import {useNavigate} from "react-router-dom";

interface Props  {
    show: boolean;
    onHide: () => void;
}

export const CancelModal = ({show, onHide}:Props) => {

    const navigate = useNavigate();
    const {clearCart} = useCart();

    const cancelOrder = () => {
      clearCart();
      navigate('/mipedido')
      onHide();
    }

  return(
      <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
              <Modal.Title>Cancelar Pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <p>¿Está seguro que desea cancelar el pedido?</p>
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