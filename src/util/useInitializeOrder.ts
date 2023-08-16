import React, { useState } from "react";
import { Order, OrderDetail } from "../interfaces/customer.ts";

const defaultOrder: Order = {
    id: 0,
    paid: false,
    total: 0,
    discount: 0,
    phone: "",
    address: "",
    apartment: "",
    orderDate: new Date(),
    estimatedTime: "",
    deliveryTypeId: 0,
    paymentTypeId: 0,
    orderStatusId: 0,
    orderDetails: [],
    customerId: 0,
};

const defaultOrderDetail: OrderDetail = {
    id: 0,
    quantity: 0,
    subtotal: 0,
    itemId: 0,
};

export const useInitializeOrder = (ords: Order[] | undefined): [Order[], React.Dispatch<React.SetStateAction<Order[]>>, () => Order[]] => {
    const [orders, setOrders] = useState<Order[]>(ords ?? [defaultOrder]);
    const createNewOrders = () => {
        const newOrders = [{ ...defaultOrder }];
        newOrders[0].orderDetails = [defaultOrderDetail];
        return newOrders;
    };
    return [orders, setOrders, createNewOrders];
};
