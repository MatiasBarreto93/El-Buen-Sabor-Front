import {useGetCustomer} from "../../services/useGetCustomer.ts";
import {useAuth0} from "@auth0/auth0-react";
import {useInitializeCustomer} from "../trabajo/menus/employees/hooks/useInitializeCustomer.ts";
import {CustomerPersonalData} from "./customerPersonalData.tsx";
import './../styles/background.css'
import {useEffect} from "react";

const MiPerfil = () => {

    const getCustomer = useGetCustomer();
    const {user} = useAuth0();

    const [cliente, setCliente ] = useInitializeCustomer(undefined);

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
            <CustomerPersonalData cliente={cliente}/>
        </div>
    )
}

export default MiPerfil;