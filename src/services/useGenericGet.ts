import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

export const useGenericGet = <T>(endpoint: string, entidadMsj: string, refetch?:boolean) => {

    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";
    const { getAccessTokenSilently } = useAuth0();

    const [data, setData] = useState<T[]>([]);

    useEffect(() => {
        fetchData();
    }, [refetch]);

    const fetchData = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${url}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            //console.log(response.status);
            if (response.ok) {
                const data = await response.json();
                //console.log(data);
                setData(data)
            } else {
                console.error(`Error fetching ${entidadMsj} data:`, response.status);
            }
        } catch (e) {
            console.error(`Error fetching ${entidadMsj} data:`, e);
        }
    };
    return data;
}