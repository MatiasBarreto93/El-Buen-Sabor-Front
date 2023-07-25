import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import secureLS from "../util/secureLS.ts";

export const useGenericCacheGet = <T>(endpoint: string, entidadMsj: string) => {

    const { getAccessTokenSilently } = useAuth0();
    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";
    const [data, setData] = useState<T[]>([]);


    const fetchData = async () => {
        //Check if data is in cache, if yes return the data from the cache
        const cachedData: T[] | null = secureLS.get(endpoint);
        if (cachedData) {
            setData(cachedData);
            return;
        }

        // If not present in cache or cacheRefetch=true, then make request to fetch data
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${url}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const responseData: T[] = await response.json();
                secureLS.set(endpoint, responseData);
                setData(responseData);

            } else {
                console.error(`Error fetching ${entidadMsj} data:`, response.status);
            }
        } catch (e) {
            console.error(`Error fetching ${entidadMsj} data:`, e);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return {data, fetchData};
}


