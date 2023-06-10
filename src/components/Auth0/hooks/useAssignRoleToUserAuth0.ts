import {useAuth0} from "@auth0/auth0-react";
import {toast} from "react-toastify";

export const useAssignRoleToUserAuth0 = () => {

    const { getAccessTokenSilently } = useAuth0();
    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";

    const assignRoleToUserAuth0 = async (userId: string, roleId: string) => {
        try {
            const token = await getAccessTokenSilently();
            const requestBody = { users: [userId] };

            const response = await fetch(`${url}auth0/users/${roleId}/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                toast.error('Ha ocurrido un error', {
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error('Error assigning user to role:', error);
            toast.error('Ha ocurrido un error' + error, {
                position: 'top-center',
            });
        }
    }
    return assignRoleToUserAuth0;
}