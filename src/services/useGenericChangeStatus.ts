import {useAuth0} from "@auth0/auth0-react";
import {toast} from "react-toastify";

export const useGenericChangeStatus = () => {

    const { getAccessTokenSilently } = useAuth0();
    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";

    const updateEntityStatus = async (id: number,blocked:boolean, endpoint: string, entidadMsj:string) => {
        try {

            const token = await getAccessTokenSilently();

            await fetch(`${url}${endpoint}/${id}/block?blocked=${blocked}`, {
                method: 'PUT',
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(`Estado del ${entidadMsj} Actualizado`, {
                position: "top-center",
            });
        } catch (error) {
            toast.error(`Ah ocurrido un error al tratar de cambiar el estado de ${entidadMsj}`, {
                position: "top-center",
            });
        }
    }
    return updateEntityStatus;
}