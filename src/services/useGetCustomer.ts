import { useAuth0 } from "@auth0/auth0-react";
import { Customer } from "../interfaces/customer.ts";
import {useInitializeCustomer} from "../components/trabajo/menus/employees/hooks/useInitializeCustomer.ts";
import secureLS from "../util/secureLS.ts";

export const useGetCustomer = () => {
    const url = import.meta.env.VITE_BACKEND_API_URL || "";
    const { getAccessTokenSilently } = useAuth0();
    const [,, createNewCustomer] = useInitializeCustomer(undefined)

    const getCustomer = async (auth0Id: string | undefined): Promise<Customer> => {
        let fetchedCustomer;
        try {
            if (auth0Id) {

                const cachedCustomer: Customer | null = secureLS.get(auth0Id);
                if (cachedCustomer) {
                    return cachedCustomer;
                }

                const token = await getAccessTokenSilently();
                const encoded = encodeURIComponent(auth0Id);
                const response = await fetch(`${url}customers/info?auth0Id=${encoded}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const contentType = response.headers.get("content-type");

                if (response.ok && contentType && contentType.includes("application/json")) {
                    fetchedCustomer = await response.json();
                    secureLS.set(auth0Id, fetchedCustomer);
                } else {
                    fetchedCustomer = createNewCustomer();
                }
            }
        } catch (e) {
            console.error(`Error fetching customer data:`, e);
        }
        return fetchedCustomer;
    };
    return getCustomer;
};