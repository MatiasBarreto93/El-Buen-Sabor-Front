import {useAuth0} from "@auth0/auth0-react";
import {Auth0Roles} from "../../../interfaces/customer.ts";

export const useGetUserRolesAuth0 = () => {

    const { getAccessTokenSilently } = useAuth0();
    const url: string = import.meta.env.VITE_BACKEND_API_URL || "";

    const getUserRolesAuth0 = async (userId: string): Promise<Auth0Roles[]> => {
        try {
            const token = await getAccessTokenSilently();

            const encodedUserId = encodeURIComponent(userId).replaceAll('|', '%7C');

            const response = await fetch(`${url}auth0/users/${encodedUserId}/roles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const roles = await response.json();
                return roles.filter(isValidRole)
            } else {
                console.error('Error retrieving user roles:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Error retrieving user roles:', error);
            return [];
        }
    }
    const isValidRole = (role: Auth0Roles): boolean => {
        return role.id !== undefined && role.name !== undefined && role.description !== undefined;
    };
    return getUserRolesAuth0;
}