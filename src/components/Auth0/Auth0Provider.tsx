import {ReactNode, useEffect} from "react";
import {Auth0Provider, useAuth0} from "@auth0/auth0-react";

interface Props {
    children?: ReactNode;
    initialAuthState: {
        isAuthenticated: boolean;
        idToken: string;
    };
}

export function AuthProvider({ children, initialAuthState }: Props):JSX.Element{

    const { isAuthenticated, getIdTokenClaims } = useAuth0();

    useEffect(() => {
        const storeAuthState = async () => {
            if (isAuthenticated) {
                const idToken = await getIdTokenClaims();
                localStorage.setItem(
                    "authState",
                    JSON.stringify({ isAuthenticated, idToken })
                );
            } else {
                localStorage.removeItem("authState");
            }
        };
        storeAuthState();
    }, [isAuthenticated, getIdTokenClaims, initialAuthState]);

    const domain: string = import.meta.env.VITE_AUTH0_DOMAIN || "";
    const clienteId: string = import.meta.env.VITE_AUTH0_CLIENT_ID || "";
    const audience: string = import.meta.env.VITE_AUTH0_AUDIENCE || "";

    return (
        <Auth0Provider
            domain={domain}
            clientId={clienteId}
            authorizationParams={{
                audience: audience,
                redirect_uri: window.location.origin
        }}
            cacheLocation={"localstorage"}
        >
            {children}
        </Auth0Provider>
    );
}