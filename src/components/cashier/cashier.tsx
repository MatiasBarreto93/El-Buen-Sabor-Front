import {useGenericGet} from "../../services/useGenericGet.ts";
import {Order, OrderDetail, OrderStatus} from "../../interfaces/customer.ts";
import React, {useEffect, useState} from "react";
import {Form, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {CancelOrderModal} from "./CancelOrderModal.tsx";
import {useInitializeOrder} from "../../util/useInitializeOrder.tsx";
import {InfoButton} from "../table/InfoButton.tsx";
import {CancelButton} from "../table/CancelButton.tsx";
import {useGenericPut} from "../../services/useGenericPut.ts";
import {useGenericCacheGet} from "../../services/useGenericCacheGet.ts";

const Cashier = () => {

    const navigate = useNavigate();
    const genericPut = useGenericPut();

    //Orders
    const [refetch, setRefetch] = useState(false)
    const dataOrders = useGenericGet<Order>(`orders`, "Ordenes", refetch);
    const [orders, setOrders] = useState<Order[]>([]);

    //Order Status
    const {data} = useGenericCacheGet<OrderStatus>("order-status","Order Statuses");
    const [orderSt, setOrderSt] = useState<OrderStatus[]>([]);

    //Cancel order
    const [order, setOrder] = useInitializeOrder(undefined);
    const [showModalCancel, setShowModalCancel] = useState(false);

    //Filters
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    //Order Status Style
    const orderStatuses = [
        {id: 1, state: "A confirmar", color: "gray"},
        {id: 2, state: "En Cocina", color: "#FBC02D"},
        {id: 3, state: "Listo", color: "#D32F2F"},
        {id: 4, state: "En Delivery", color: "#0070ff"},
        {id: 5, state: "Entregado", color: "#34A853"},
    ];

    const handleStatushange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(Number(event.target.value));
    };

    const handleSearchChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filterByStatus = (orders: Order[]) => {
        let filteredOrders = orders;

        if (selectedStatus) {
            filteredOrders = filteredOrders.filter(ord => ord.orderStatusId === selectedStatus);
        }

        if (searchQuery) {
            filteredOrders = filteredOrders.filter(ord => ord.id.toString().includes(searchQuery));
        }

        return filteredOrders;
    }

    const handleCancelModal = (order: Order) => {
      setOrder(order);
      setShowModalCancel(true);
    }

    useEffect(() =>{
        setOrderSt(data);
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

    const getStatusColor = (statusId: number) => {
        const status = orderStatuses.find(status => status.id === statusId);
        return status ? status.color : 'black';
    };
    const checkDrinksOnly = (orderDetails: OrderDetail[]) =>{
        return  orderDetails.every(detail => detail.itemProduct === null);
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
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <h5 className="mx-3" style={{marginTop: "5px"}}>Buscar por Nº Order:</h5>
                    <Form.Group>
                        <Form.Control type="text" placeholder="ID..." onChange={handleSearchChange} />
                    </Form.Group>
                </div>
                <div className="d-flex">
                    <h5 className="mx-3" style={{marginTop: "5px"}}>Filtrar por Estado:</h5>
                    <Form.Group>
                        <Form.Select onChange={handleStatushange}>
                            <option value={0}>-</option>
                            {orderSt.map((ost:OrderStatus) =>(
                                <option key={ost.id} value={ost.id}>
                                    {ost.denomination}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </div>
            </div>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Nº Order</th>
                    <th>Nombre Apellido</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Forma Entrega</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {filterByStatus(orders).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).map(order =>(
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customerName} {order.customerLastname}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString('en-GB')} - {new Date(order.orderDate).toLocaleTimeString().slice(0,5)}</td>
                        <td style={{fontWeight: 'bold'}}>${order.total}</td>
                        <td>{order.deliveryTypeId === 1 ? "Delivery" : "Retiro en Local"}</td>
                        <td>
                            {order.cancelled  || order.orderStatusId === 5 ?
                                (
                                    <div style={{fontWeight: 'bold', color: order.cancelled ? '#D32F2F' : '#34A853'}}>{order.cancelled ? "Cancelado" : "Entregado"}</div>
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

                                        if (status.state === 'En Cocina') {
                                            shouldRender = (order.paid && !checkDrinksOnly(order.orderDetails)) || (order.deliveryTypeId === 2 && order.paymentTypeId === 1 && !checkDrinksOnly(order.orderDetails));
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
                                )}
                        </td>
                        <td><InfoButton onClick={() => handleShowDetails(order)}/></td>
                        <td>
                            {order.cancelled  || order.orderStatusId === 5 ?
                                (
                                    <div></div>
                                ) :
                                (
                                    <CancelButton onClick={() => handleCancelModal(order)}/>
                                )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
            {showModalCancel && (
                <CancelOrderModal
                    ord={order}
                    show={showModalCancel}
                    setRefetch={setRefetch}
                    onHide={() => setShowModalCancel(false)}
                />
            )}
        </>
    )
}

export default Cashier;