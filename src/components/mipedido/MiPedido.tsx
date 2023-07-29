import {FullCart} from "./fullCart/FullCart.tsx";
import {useGetCustomer} from "../../services/useGetCustomer.ts";
import {useAuth0} from "@auth0/auth0-react";
import {useInitializeCustomer} from "../trabajo/menus/employees/hooks/useInitializeCustomer.ts";
import {useEffect} from "react";
import './../styles/background.css'

const MiPedido = () => {

//Hay que verificar si el carrito de compras esta vacio para mostrar un componente u otro

    const getCustomer = useGetCustomer();
    const {user} = useAuth0();

    const [cliente, setCliente ] = useInitializeCustomer(undefined);

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
            <FullCart cliente={cliente}/>
        </div>
    )
}

export default MiPedido;