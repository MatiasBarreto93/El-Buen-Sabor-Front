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
    total: number;
    discount: number;
    phone: string;
    address: string;
    apartment: string;
    orderDate: Date;
    estimatedTime: string;
    deliveryTypeId: number;
    paymentTypeId: number;
    orderStatusId: number;
    orderDetails: OrderDetail[];
    customerId: number;
}

export interface OrderDetail {
    id: number;
    quantity: number;
    subtotal: number;
    itemId: number;
    itemProduct: Product;
    itemDrink: Drink;
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