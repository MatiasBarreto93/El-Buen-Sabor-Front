import {Button} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";

export const LogInButton = () =>{

    const {loginWithRedirect} = useAuth0()

    return(
        <div className="d-flex">
            <Button variant="primary" className="mx-2 boton" onClick={() => loginWithRedirect()}>Ingresar</Button>
        </div>
    )
}