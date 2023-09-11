import React, { useState } from "react";
import { Order, OrderDetail } from "../interfaces/customer.ts";

const defaultOrder: Order = {
    id: 0,
    paid: false,
    cancelled: false,
    total: 0,
    discount: 0,
    phone: "",
    address: "",
    apartment: "",
    orderDate: new Date(),
    estimatedTime: 0,
    deliveryTypeId: 0,
    paymentTypeId: 0,
    orderStatusId: 0,
    customerName: "",
    customerLastname: "",
    orderDetails: [],
    customerId: 0,
};

const defaultOrderDetail: OrderDetail = {
    id: 0,
    quantity: 0,
    subtotal: 0,
    itemId: 0,
};

export const useInitializeOrder = (ord: Order | undefined): [Order, React.Dispatch<React.SetStateAction<Order>>, () => Order] => {
    const [order, setOrder] = useState<Order>(ord ?? defaultOrder);

    const createNewOrder = () => {
        const newOrder = { ...defaultOrder };
        newOrder.orderDetails = [defaultOrderDetail];
        return newOrder;
    };

    return [order, setOrder, createNewOrder];
};