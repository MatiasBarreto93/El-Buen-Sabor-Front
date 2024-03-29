import {Form, Table} from "react-bootstrap";
import {InfoButton} from "../table/InfoButton.tsx";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useGenericPut} from "../../services/useGenericPut.ts";
import {useGenericGet} from "../../services/useGenericGet.ts";
import {Order} from "../../interfaces/customer.ts";
import {AddTimeButton} from "../table/AddTimeButton.tsx";

const Kitchen = () => {

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
        {id: 2, state: "En Cocina", color: "#FBC02D"},
        {id: 3, state: "Listo", color: "#D32F2F"},
    ];

    const getStatusColor = (statusId: number) => {
        const status = orderStatuses.find(status => status.id === statusId);
        return status ? status.color : 'black';
    };

    //Delivery Filter
    const filterByStatus = (orders: Order[]) => {
        let filteredOrders = orders;
        filteredOrders = filteredOrders.filter(ord => [2].includes(ord.orderStatusId) && ord.paid);
        return filteredOrders;
    }

    //Change order status
    const handleOrderStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>, ord: Order) => {
        const selected = Number(event.target.value);
        const newOrderStatus = { ...ord, orderStatusId: selected };
        await genericPut<Order>("orders", ord.id, newOrderStatus, "Estado de Orden Actualizado");
        setRefetch(true);
    }

    const handleAddTimeButton = async (ord: Order) => {
        const newOrderTime = { ...ord, estimatedTime: (ord.estimatedTime + 10) };
        await genericPut<Order>("orders", ord.id, newOrderTime, "Tiempo agregar a la Orden");
        setRefetch(true);
    }

    //Details
    const handleShowDetails = (order: Order) => {
        navigate(`/detalle-orden-cocina/${order.id}`, { state: { order } });
    }

  return(
      <>
          <div className="m-3">
              <Table hover>
                  <thead>
                  <tr className="encabezado">
                      <th>Nº Order</th>
                      <th>Nombre Apellido</th>
                      <th>Fecha</th>
                      <th>Tiempo Estimado</th>
                      <th></th>
                      <th>Estado</th>
                      <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {filterByStatus(orders).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).map(order =>(
                      <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.customerName} {order.customerLastname}</td>
                          <td>{new Date(order.orderDate).toLocaleDateString('en-GB')} - {new Date(order.orderDate).toLocaleTimeString().slice(0,5)}</td>
                          <td>{order.estimatedTime}' Min</td>
                          <td><AddTimeButton onClick={() => handleAddTimeButton(order)}/></td>
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

                                              if (status.state === 'En Cocina' || status.state === "Listo") {
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

export default Kitchen;