import {Layout} from "../Layout/layout.tsx";
import {useGetCustomer} from "../../services/useGetCustomer.ts";
import {useAuth0} from "@auth0/auth0-react";
import {useInitializeCustomer} from "../trabajo/menus/employees/hooks/useInitializeCustomer.ts";
import {useEffect} from "react";
import {CustomerPersonalData} from "./customerPersonalData.tsx";

export const MiPerfil = () => {

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
    }, [user?.sub, setCliente]);

    return(
        <Layout>
            <CustomerPersonalData cliente={cliente}/>
        </Layout>
    )
}