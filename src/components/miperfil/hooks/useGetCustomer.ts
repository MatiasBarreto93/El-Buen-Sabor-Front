import { useAuth0 } from "@auth0/auth0-react";
import { Customer } from "../../../interfaces/customer.ts";

export const useGetCustomer = () => {
    const url = import.meta.env.VITE_BACKEND_API_URL || "";
    const { getAccessTokenSilently } = useAuth0();

    const getCustomer = async (auth0Id: string | undefined): Promise<Customer> => {
        let fetchedCustomer;
        try {
            if (auth0Id) {
                const token = await getAccessTokenSilently();
                const encoded = encodeURIComponent(auth0Id);
                const response = await fetch(`${url}customers/info?auth0Id=${encoded}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    fetchedCustomer = await response.json();
                }
            }
        } catch (e) {
            console.error(`Error fetching customer data:`, e);
        }
        return fetchedCustomer;
    };
    return getCustomer;
};