import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import {format} from "date-fns";

export const useGenericGetDate = <T>(endpoint: string, entidadMsj: string, startDate: Date, endDate: Date) => {

    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";
    const { getAccessTokenSilently } = useAuth0();

    const [data, setData] = useState<T[]>([]);
    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const fetchData = async () => {
        try {
            const token = await getAccessTokenSilently();
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const response = await fetch(`${url}${endpoint}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data  = await response.json();
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
