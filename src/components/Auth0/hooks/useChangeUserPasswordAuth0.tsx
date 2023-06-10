import {useAuth0} from "@auth0/auth0-react";
import {toast} from "react-toastify";

export const useChangeUserPasswordAuth0 = () => {

    const { getAccessTokenSilently } = useAuth0();
    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";

    const changeUserPasswordAuth0 = async (auth0UserId: string, password: string | undefined) => {
        try {
            const encodedUserId = encodeURIComponent(auth0UserId).replaceAll("|", "%7C");
            const token = await getAccessTokenSilently();
            const requestBody = { password: password };

            const response = await fetch(`${url}auth0/users/${encodedUserId}/change-password`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestBody),
                }
            );
            if (!response.ok) {
                toast.error("Ha ocurrido un error", {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error assigning new password to user:", error);
            toast.error("Ha ocurrido un error" + error, {
                position: "top-center",
            });
        }
    };
    return changeUserPasswordAuth0;
};