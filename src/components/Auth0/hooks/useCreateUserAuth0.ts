import {useAuth0} from "@auth0/auth0-react";
import {toast} from "react-toastify";
import {Auth0User} from "../../../interfaces/customer.ts";

export const useCreateUserAuth0 = () => {

    const { getAccessTokenSilently } = useAuth0();
    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";

    const createUserAuth0 = async (newUser: Auth0User) => {
        try {
            const token = await getAccessTokenSilently();

            const requestBody = {
                email: newUser.email,
                password: newUser.password,
                blocked: newUser.blocked,
            };

            const response = await fetch(`${url}auth0/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const responseBody = await response.json();
                const userId = responseBody.user_id;
                return userId;
            }
        } catch (error) {
            console.error('Error creating new user:', error);
            toast.error("Ah ocurrido un error" + error, {
                position: "top-center",
            });
        }
    }
    return createUserAuth0;
}