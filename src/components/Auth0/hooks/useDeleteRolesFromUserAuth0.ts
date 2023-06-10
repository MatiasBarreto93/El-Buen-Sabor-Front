import {useAuth0} from "@auth0/auth0-react";
import {toast} from "react-toastify";
import {Auth0Roles} from "../../../interfaces/customer.ts";

export const useDeleteRolesFromUserAuth0 = () => {

    const { getAccessTokenSilently } = useAuth0();
    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";

    const deleteRolesFromUserAuth0 = async (userId: string, userRoles: Auth0Roles[]) => {
        try {
            const token = await getAccessTokenSilently();
            const encodedUserId = encodeURIComponent(userId).replaceAll('|', '%7C');

            const roleIds: string[] = userRoles.map(role => role.id);

            const response = await fetch(`${url}auth0/users/${encodedUserId}/roles`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ roles: roleIds }),
            });

            if (!response.ok) {
                toast.error('Ah ocurrido un error', {
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error('Error deleting roles from user:', error);
            toast.error('Ah ocurrido un error' + error, {
                position: 'top-center',
            });
        }
    }
    return deleteRolesFromUserAuth0;
}