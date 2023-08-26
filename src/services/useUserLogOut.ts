import {useAuth0} from "@auth0/auth0-react";

export const useUserLogOut = () => {
    const { getAccessTokenSilently } = useAuth0();
    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";

    const logOut = async (auth0: string) => {
        const token = await getAccessTokenSilently();
        const encodedAuth0 = encodeURIComponent(auth0).replaceAll('|', '%7C');

        await fetch(`${url}user/log-out?auth0=${encodedAuth0}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return logOut;
}