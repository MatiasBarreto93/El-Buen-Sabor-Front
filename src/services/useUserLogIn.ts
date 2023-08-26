import {useAuth0} from "@auth0/auth0-react";

export const useUserLogIn = () => {
    const { getAccessTokenSilently } = useAuth0();
    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";

    const logIn = async (auth0: string) => {
        const token = await getAccessTokenSilently();
        const encodedAuth0 = encodeURIComponent(auth0).replaceAll('|', '%7C');

        await fetch(`${url}user/log-in?auth0=${encodedAuth0}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return logIn;
}