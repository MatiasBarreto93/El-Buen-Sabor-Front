import {Drink, Product} from "./products.ts";

export interface Customer {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    address: string;
    apartment: string;
    user: User;
}

export interface User {
    id: number;
    auth0Id: string;
    email: string;
    blocked: boolean;
    logged: boolean;
    password: string,
    confirmPassword: string,
    role: Role;
}

export interface Role {
    id: number;
    denomination: string;
    auth0RolId: string;
}

export interface Order {
    id: number;
    paid: boolean;
    cancelled: boolean;
    total: number;
    discount: number;
    phone: string;
    address: string;
    apartment: string;
    orderDate: Date;
    estimatedTime: number;
    deliveryTypeId: number;
    paymentTypeId: number;
    orderStatusId: number;
    customerName?: string;
    customerLastname?: string;
    orderDetails: OrderDetail[];
    customerId: number;
}

export interface OrderDetail {
    id: number;
    quantity: number;
    subtotal: number;
    itemId: number;
    itemProduct?: Product;
    itemDrink?: Drink;
}

export interface OrderStatus{
    id: number;
    denomination: string;
}

export interface Auth0User {
    email?: string;
    password?: string;
    blocked?: boolean;
}

export interface Auth0Roles{
    id: string;
    name: string;
    description: string
}

export interface Auth0Password {
    password: string;
    confirmPassword: string;
}