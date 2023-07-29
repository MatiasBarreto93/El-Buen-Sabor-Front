import {useAuth0} from "@auth0/auth0-react";
import {NavDropdown} from "react-bootstrap";
import {Person, Bag, Shop, Power, Receipt} from "react-bootstrap-icons";
import jwt_decode from 'jwt-decode';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface PermissionsType {
    permissions: string[];
}

export const DropDownMenu = () =>{

    const navigate = useNavigate();
    const { user, getAccessTokenSilently, logout } = useAuth0();
    const [isCliente, setIsCliente] = useState(true);

    const handleLogout = () => {
        localStorage.setItem('firstRender', JSON.stringify(true));
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    const decodeToken = async () => {
        const fetchedToken = await getAccessTokenSilently();
        const decoded = jwt_decode<PermissionsType>(fetchedToken);
        setIsCliente(decoded.permissions[0] === "Cliente");
    };

    useEffect(() => {
        const onRender = async () => {
            await decodeToken();
        };
        onRender();
    }, [decodeToken]);

    return (
        <div className="d-flex">
            <NavDropdown title={user?.name} id="navbarScrollingDropdown" className="navUserMenuContainer p-2">
                <NavDropdown.Item onClick={() => navigate('/miperfil')}><Person size={20} className="mx-2 align-content-center"/>Mi Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => navigate('/mipedido')}><Bag size={20} className="mx-2"/>Mi Pedido</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => navigate('/historialpedido')}><Receipt size={20} className="mx-2"/>Historial de Pedidos</NavDropdown.Item>
                <NavDropdown.Divider />
                {!isCliente && (
                    <>
                        <NavDropdown.Item onClick={() => navigate('/trabajo')}><Shop size={20} className="mx-2"/>Trabajo</NavDropdown.Item>
                        <NavDropdown.Divider />
                    </>
                )}
                <NavDropdown.Item onClick={() => handleLogout()} className="text-danger"><Power size={20} color={"red"} className="mx-2"/>Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
        </div>
    )
}