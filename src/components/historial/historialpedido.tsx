import {useEffect, useState} from "react";
import './../styles/background.css'
import './../../components/mipedido/fullCart/fullCart.css'
import {useAuth0} from "@auth0/auth0-react";
import {useGetCustomer} from "../../services/useGetCustomer.ts";
import {useInitializeCustomer} from "../trabajo/menus/employees/hooks/useInitializeCustomer.ts";
import {OrdersHistoryTable} from "./OrdersHistoryTable.tsx";
const Historialpedido = () => {

    const getCustomer = useGetCustomer();
    const {user} = useAuth0();
    const [cliente, setCliente ] = useInitializeCustomer(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.sub) {
            getCustomer(user.sub)
                .then((customer) => {
                    setCliente(customer);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching customer data:", error);
                    setLoading(false);
                });
        }
    }, [user?.sub]);

    if (loading) {
        return <div/>;
    }


  return(
     <>
         {cliente && <OrdersHistoryTable id={cliente.id}/>}
     </>
  )
}

export default Historialpedido;