import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";

import {initMercadoPago} from "@mercadopago/sdk-react";

export const useMercadoPago = (totalOrder) => {

    const mercadoPagoKey : string = import.meta.env.VITE_PUBLIC_KEY || "";
    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";
    const [preferenceId, setPreferenceId] = useState(null);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        initMercadoPago(mercadoPagoKey);
    }, [mercadoPagoKey]);

    const generatePreference = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${url}mercadopago/generatePreference/${totalOrder}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({totalOrder})
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Error al generar la preferencia: ${response.statusText}. Body: ${text}`);
            }
            const data = await response.json();
            setPreferenceId(data.id);
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return { generatePreference, preferenceId };
}