export const checkEmailExists = async (email: string, token:string) => {
    const url: string = import.meta.env.VITE_BACKEND_API_URL ?? "";
    const response = await fetch(`${url}user/check-email?email=${email}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return await response.json();
}

