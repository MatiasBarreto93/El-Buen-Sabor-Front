import {ReactNode} from "react";
import {Auth0Provider} from "@auth0/auth0-react";

interface Props{
    children?: ReactNode
}

export function AuthProvider({children}:Props):JSX.Element{

    const domain:string =import.meta.env.VITE_AUTH0_DOMAIN || "";
    const clienteId:string = import.meta.env.VITE_AUTH0_CLIENT_ID || ""

    return (
        <Auth0Provider
            domain={domain}
            clientId={clienteId}
            authorizationParams={{redirect_uri: window.location.origin}}>
            {children}
        </Auth0Provider>
    )
}