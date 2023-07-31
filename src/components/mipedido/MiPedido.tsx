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
    const {items} = useCart();
    const [cliente, setCliente ] = useInitializeCustomer(undefined);

    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

    //todo reemplazar por localstorage
    useEffect(() => {
        const onRender = async () => {
            const cli = await getCustomer(user?.sub);
            if (cli) {
                setCliente(cli);
            }
        };
        onRender();
    }, [user?.sub, setCliente, getCustomer]);
    
    return(
        <div className="perfil-img">
            {totalQuantity > 0 ? <FullCart cliente={cliente}/> : <EmpyCart />}
        </div>
    )
}

export default MiPedido;