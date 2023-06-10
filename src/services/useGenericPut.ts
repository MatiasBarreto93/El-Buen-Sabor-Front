import {useAuth0} from "@auth0/auth0-react";
import {toast} from "react-toastify";

export const useGenericPut = () => {

    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";
    const { getAccessTokenSilently } = useAuth0();

    const genericPut = async <T>(endpoint: string, id:number, obj:T, entidadMsj:string) => {
        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`${url}${endpoint}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(obj),
            });
            if (response.ok) {
                toast.success(`${entidadMsj} Editado`, {
                    position: "top-center",
                });
            }
        } catch (error) {
            toast.error(`Ah ocurrido un error al Editar un ${entidadMsj}` + error, {
                position: "top-center",
            });
        }
    }
    return genericPut;
}