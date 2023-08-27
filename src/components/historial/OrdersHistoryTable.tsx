import {Order} from "../../interfaces/customer.ts";
import {useGenericGet} from "../../services/useGenericGet.ts";
import {useInitializeOrders} from "../../util/useInitializeOrders.ts";
import {useEffect} from "react";
import {Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {InfoButton} from "../table/InfoButton.tsx";
interface Props{
    id: number;
}

export const OrdersHistoryTable = ({id}:Props) => {

    const navigate = useNavigate();

    const dataOrders = useGenericGet<Order>(`orders/${id}/purchase-history`, "Ordenes");
    const [orders, setOrders] = useInitializeOrders(undefined);

    useEffect(() =>{
        setOrders(dataOrders);
    },[dataOrders])

    const handleOrderState = (num:number) => {
        switch (num) {
            case 1:
                return { state: "A confirmar", color: "gray" };
            case 2:
                return { state: "En Cocina", color: "#FBC02D" };
            case 3:
                return { state: "Listo", color: "#D32F2F" };
            case 4:
                return { state: "En Delivery", color: "#0070ff" };
            case 5:
                return { state: "Entregado", color: "#34A853" };
            default:
                return { state: "Error", color: "red" };
        }
    }

    const handleShowDetails = (order: Order) => {
        navigate(`/detalle-orden/${order.id}`, { state: { order } });
    }

    return(
        <div className="perfil-img">
            <div className="d-flex justify-content-center">
                <div className="rectangle mt-5 mb-5" style={{width: '95%', minHeight: '800px' }}>
                    <h4 className="title">Historial de Pedidos</h4>
                    <Table hover>
                        <thead>
                        <tr className="encabezado">
                            <th>Nº Order</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {[...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).map(order =>(
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString('en-GB')} - {new Date(order.orderDate).toLocaleTimeString().slice(0,5)}</td>
                                <td style={{fontWeight: 'bold'}}>${order.total}</td>
                                <td style={{fontWeight: 'bold', color: handleOrderState(order.orderStatusId).color}}>
                                    {order.cancelled ?
                                        (
                                            <div style={{fontWeight: 'bold', color: '#D32F2F'}}>{order.cancelled && "Cancelado"}</div>
                                        )
                                        :
                                        (
                                            <div style={{fontWeight: 'bold', color: handleOrderState(order.orderStatusId).color}}>{handleOrderState(order.orderStatusId).state}</div>
                                        )}
                                </td>
                                <td><InfoButton onClick={() =>handleShowDetails(order)}/></td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}