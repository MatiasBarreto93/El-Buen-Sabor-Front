import {useGenericGet} from "../../services/useGenericGet.ts";
import {Customer, Order} from "../../interfaces/customer.ts";
import {useEffect, useState} from "react";
import {Button, Form, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const Cajero = () => {

    const navigate = useNavigate();

    const [refetch, setRefetch] = useState(false)

    const dataOrders = useGenericGet<Order>(`orders`, "Ordenes", refetch);
    const [orders, setOrders] = useState<Order[]>([]);

    const dataCustomers = useGenericGet<Customer>(`customers`, "Clientes", refetch);
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() =>{
        setOrders(dataOrders);
        setCustomers(dataCustomers);
    },[dataOrders, refetch])

    // console.log(JSON.stringify(orders, null, 2))
    // console.log(JSON.stringify(customers, null, 2))

    const orderStatuses = [
        {id: 1, state: "A confirmar", color: "gray"},
        {id: 2, state: "En Cocina", color: "#FBC02D"},
        {id: 3, state: "Listo", color: "#D32F2F"},
        {id: 4, state: "En Delivery", color: "#0070ff"},
        {id: 5, state: "Entregado", color: "#34A853"},
    ];

    const getStatusColor = (statusId: number) => {
        const status = orderStatuses.find(status => status.id === statusId);
        return status ? status.color : 'black';
    };

    const checkDrinksOnly = (orderDetails: Array<{itemProduct: null | any}>) =>{
        return  orderDetails.every(detail => detail.itemProduct === null);
    }

    //Todo make it asynchronous
    function getCustomerName(id: number) {
        const customer = customers.find(c => c.id === id);
        return customer ? `${customer.name} ${customer.lastname}` : 'Customer not found';
    }


    const handleOrderStatusChange = () => {
        console.log("asd")
    }

    const handleShowDetails = (order: Order) => {
        navigate(`/cajero-detalle-orden/${order.id}`, { state: { order } });
    }

    return(
        <div className="d-flex w-90">
            <Table hover className="m-3">
                <thead>
                <tr className="encabezado">
                    <th>Nº Order</th>
                    <th>Nombre Apellido</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Forma Entrega</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {[...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).map(order =>(
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{getCustomerName(order.customerId)}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString('en-GB')} - {new Date(order.orderDate).toLocaleTimeString().slice(0,5)}</td>
                        <td style={{fontWeight: 'bold'}}>${order.total}</td>
                        <td>{order.deliveryTypeId === 1 ? "Delivery" : "Retiro en Local"}</td>
                        <td>
                            <Form.Select
                                style={{ fontWeight: 'bold', color: getStatusColor(order.orderStatusId) }}
                                value={order.orderStatusId}
                                onChange={handleOrderStatusChange}
                            >
                                {orderStatuses.map((status) => {
                                    let shouldRender = true;

                                    if (status.state === 'En Cocina') {
                                        shouldRender = (order.paid && !checkDrinksOnly(order.orderDetails)) || (order.deliveryTypeId === 2 && order.paymentTypeId === 1);
                                    } else if (status.state === "Listo"){
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
                        </td>
                        <td><Button onClick={() =>handleShowDetails(order)}>Detalles</Button></td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Cajero;