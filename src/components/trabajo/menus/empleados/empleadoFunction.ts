import {Auth0Roles, Auth0User} from "../../../../types/customer.ts";
import {toast} from "react-toastify";

export async function fetchRoles(token:string) {
    try {
        const response = await fetch("http://localhost:8080/api/v1/roles", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            return(data)
        } else {
            console.error("Error fetching data:", response.status);
        }
    } catch (e) {
        console.error("Error fetching data:", e);
    }
}

export async function newAuth0User(newUser: Auth0User, token:string) {
    try {

        const requestBody = {
            email: newUser.email,
            password: newUser.password,
            blocked: newUser.blocked,
        };

        const response = await fetch('http://localhost:8080/api/v1/auth0/users', {
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

export async function getUserRoles(userId: string, token:string): Promise<string[]> {
    try {
        const encodedUserId = encodeURIComponent(userId).replaceAll('|', '%7C');
        const response = await fetch(`http://localhost:8080/api/v1/auth0/users/${encodedUserId}/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const roles = await response.json();
            return roles.map((role: Auth0Roles) => role.id);
        } else {
            console.error('Error retrieving user roles:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error retrieving user roles:', error);
        return [];
    }
}

export async function deleteRolesFromUser(userId: string, userRoles: string[], token:string) {
    try {
        const encodedUserId = encodeURIComponent(userId).replaceAll('|', '%7C');

        const response = await fetch(`http://localhost:8080/api/v1/auth0/users/${encodedUserId}/roles`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ roles: userRoles }),
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

export async function assignRoleToUser(userId: string, roleId: string, token:string) {
    try {
        const url = `http://localhost:8080/api/v1/auth0/users/${roleId}/roles`;

        const requestBody = { users: [userId] };

        const response = await fetch(url, {
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

export async function updateUserBlockedStatus(userId: string, userBlock: boolean | undefined, token:string) {
    try {
        const encodedUserId = encodeURIComponent(userId).replaceAll('|', '%7C');

        const requestBody = { blocked: userBlock };

        const response = await fetch(`http://localhost:8080/api/v1/auth0/users/${encodedUserId}/block`, {
            method: 'PATCH',
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


