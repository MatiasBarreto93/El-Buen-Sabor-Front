import {useAuth0} from "@auth0/auth0-react";
import {toast} from "react-toastify";

export const useGenericPost = () => {

    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";
    const { getAccessTokenSilently } = useAuth0();

    const genericPost = async <T>(endpoint: string, msj:string ,obj?:T) => {
        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`${url}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(obj),
            });
            if (response.ok) {
                toast.success(`${msj}`, {
                    position: "top-center",
                });
            }
        } catch (error) {
            toast.error(`Ah ocurrido un error` + error, {
                position: "top-center",
            });
        }
    }
    return genericPost;
}