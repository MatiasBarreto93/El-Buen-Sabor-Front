import React, {useState} from "react";
import {Customer} from "../../../../../interfaces/customer.ts";

const defaultCustomer = {
    id: 0,
    name: "",
    lastname: "",
    phone: "",
    address: "",
    apartment: "",
    user: {
        id: 0,
        auth0Id: "",
        email: "",
        blocked: false,
        password: "",
        confirmPassword: "",
        role: {
            id: 0,
            denomination: "",
            auth0RolId: "",
        },
    },
};

export const useInitializeCustomer = (cust: Customer | undefined): [Customer, React.Dispatch<React.SetStateAction<Customer>>, () => Customer] => {
    const [customer, setCustomer] = useState<Customer>(cust ?? defaultCustomer);
    const createNewCustomer = () => defaultCustomer;
    return [customer, setCustomer, createNewCustomer];
};
