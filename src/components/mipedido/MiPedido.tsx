import {Layout} from "../Layout/layout.tsx";
import {FullCart} from "./fullCart/FullCart.tsx";
//import {EmpyCart} from "./empyCart/EmpyCart.tsx";

export const MiPedido = () => {

//Hay que verificar si el carrito de compras esta vacio para mostrar un componente u otro

    return(
        <Layout>
            {/*<EmpyCart/>*/}
            <FullCart/>
        </Layout>
    )
}