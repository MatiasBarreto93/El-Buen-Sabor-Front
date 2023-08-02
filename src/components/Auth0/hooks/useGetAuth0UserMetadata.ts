import { useAuth0 } from "@auth0/auth0-react";

export const useGetAuth0UserMetadata = () => {
    const { getAccessTokenSilently } = useAuth0();
    const url = import.meta.env.VITE_BACKEND_API_URL || "";

    const getAuth0UserMetadata = async (userId: string | undefined) => {
        try {
            const token = await getAccessTokenSilently();
            const encodedUserId = encodeURIComponent(userId || "").replaceAll("|", "%7C");

            const response = await fetch(`${url}auth0/users/${encodedUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error(`Error fetching data:`, response.status);
            }
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };
    return getAuth0UserMetadata;
};
