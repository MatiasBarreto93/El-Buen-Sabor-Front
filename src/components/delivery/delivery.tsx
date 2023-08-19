import {useGenericPut} from "../../services/useGenericPut.ts";
import React, {useEffect, useState} from "react";
import {Order} from "../../interfaces/customer.ts";
import {useNavigate} from "react-router-dom";
import {useGenericGet} from "../../services/useGenericGet.ts";
import {Form, Table} from "react-bootstrap";
import {InfoButton} from "../table/InfoButton.tsx";

const Delivery = () => {

    const navigate = useNavigate();
    const genericPut = useGenericPut();

    const [refetch, setRefetch] = useState(false)
    const dataOrders = useGenericGet<Order>(`orders`, "Ordenes", refetch);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() =>{
        setOrders(dataOrders)
        setRefetch(false);
    },[dataOrders, refetch])

    //Auto update Data
    useEffect(() => {
        const interval = setInterval(() => {
            setRefetch(true);
        }, 60000); // 60000 milliseconds = 60 seconds

        // Clear interval on component unmount to avoid memory leaks
        return () => clearInterval(interval);
    }, []);


    //Order Status Style
    const orderStatuses = [
        {id: 3, state: "Listo", color: "#D32F2F"},
        {id: 4, state: "En Delivery", color: "#0070ff"},
        {id: 5, state: "Entregado", color: "#34A853"},
    ];

    const getStatusColor = (statusId: number) => {
        const status = orderStatuses.find(status => status.id === statusId);
        return status ? status.color : 'black';
    };

    //Delivery Filter
    const filterByStatus = (orders: Order[]) => {
        let filteredOrders = orders;
        filteredOrders = filteredOrders.filter(ord => [3, 4].includes(ord.orderStatusId) && ord.deliveryTypeId === 1 && ord.paid);
        return filteredOrders;
    }

    //Change order status
    const handleOrderStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>, ord: Order) => {
        const selected = Number(event.target.value);
        const newOrderStatus = { ...ord, orderStatusId: selected };
        await genericPut<Order>("orders", ord.id, newOrderStatus, "Estado de Orden Actualizado");
        setRefetch(true);
    }

    //Details
    const handleShowDetails = (order: Order) => {
        navigate(`/detalle-orden/${order.id}`, { state: { order } });
    }

    return(
        <>
            <div className="m-3">
                <Table hover>
                    <thead>
                    <tr className="encabezado">
                        <th>Nº Order</th>
                        <th>Nombre Apellido</th>
                        <th>Direccion</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {filterByStatus(orders).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).map(order =>(
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerName} {order.customerLastname}</td>
                            <td>{order.address}, {order.apartment}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString('en-GB')} - {new Date(order.orderDate).toLocaleTimeString().slice(0,5)}</td>
                            <td style={{fontWeight: 'bold'}}>${order.total}</td>
                            <td>
                                {order.cancelled ?
                                    (
                                        <div style={{fontWeight: 'bold', color: '#D32F2F'}}>{order.cancelled && "Cancelado"}</div>
                                    )
                                    :
                                    (
                                        <Form.Select
                                            className="w-75 h-24"
                                            style={{ fontWeight: 'bold', padding: '0px 0px' ,color: getStatusColor(order.orderStatusId) }}
                                            value={order.orderStatusId}
                                            onChange={(event) => handleOrderStatusChange(event, order)}
                                        >
                                            {orderStatuses.map((status) => {
                                                let shouldRender = true;

                                                if (status.state === "Listo"){
                                                    shouldRender = order.paid;
                                                } else if (status.state === 'En Delivery') {
                                                    shouldRender = order.paid && order.deliveryTypeId === 1;
                                                } else if (status.state === 'Entregado'){
                                                    shouldRender = order.paid;
                                                }

                                                return shouldRender ? (
                                                    <option
                                                        style={{ fontWeight: 'bold', color: status.color }}
                                                        key={status.id}
                                                        value={status.id}
                                                    >
                                                        {status.state}
                                                    </option>
                                                ) : null;
                                            })}
                                        </Form.Select>
                                    )}
                            </td>
                            <td><InfoButton onClick={() => handleShowDetails(order)}/></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default Delivery;