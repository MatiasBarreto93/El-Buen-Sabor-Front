export interface Customer {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    address: string;
    apartment: string;
    user: User;
    orders: Order[];
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
    name: string;
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

//Posible solucion extend Customer
export interface Auth0Password {
    password: string;
    confirmPassword: string;
}