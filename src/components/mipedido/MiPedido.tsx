import {FullCart} from "./fullCart/FullCart.tsx";
import {useGetCustomer} from "../../services/useGetCustomer.ts";
import {useAuth0} from "@auth0/auth0-react";
import {useInitializeCustomer} from "../trabajo/menus/employees/hooks/useInitializeCustomer.ts";
import {useEffect} from "react";
import './../styles/background.css'
import {useCart} from "../../context/cart/CartContext.tsx";
import {EmpyCart} from "./empyCart/EmpyCart.tsx";

const MiPedido = () => {

    const getCustomer = useGetCustomer();
    const {user} = useAuth0();
    const [cliente, setCliente ] = useInitializeCustomer(undefined);

    const {items} = useCart();

    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        if (user?.sub) {
            getCustomer(user.sub)
                .then((customer) => {
                    setCliente(customer);
                })
                .catch((error) => {
                    console.error("Error fetching customer data:", error);
                });
        }
    }, [user?.sub]);

    return(
        <div className="perfil-img">
            {totalQuantity > 0 ? <FullCart cliente={cliente}/> : <EmpyCart />}
        </div>
    )
}

export default MiPedido;