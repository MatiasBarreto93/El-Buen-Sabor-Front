import {useAuth0} from "@auth0/auth0-react";
import {NavDropdown} from "react-bootstrap";
import {Person, Bag, Shop, Power, Receipt} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";
import {useUserPermission} from "../../../context/permission/UserPermission.tsx";
import {useEffect} from "react";
import {UserRole} from "../../../interfaces/UserRole.ts";
import secureLS from "../../../util/secureLS.ts";

export const DropDownMenu = () =>{

    const navigate = useNavigate();
    const { user, logout } = useAuth0();
    const { permission, loadUserPermission } = useUserPermission();

    const handleLogout = () => {
        localStorage.setItem('firstRender', JSON.stringify(true));
        localStorage.removeItem('cartItems');
        localStorage.removeItem('/')
        secureLS.clear();
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    useEffect(() => {
        loadUserPermission();
    }, [loadUserPermission]);

    return (
        <div className="d-flex">
            <NavDropdown title={user?.name} id="navbarScrollingDropdown" className="navUserMenuContainer p-2">
                <NavDropdown.Item onClick={() => navigate('/miperfil')}><Person size={20} className="mx-2 align-content-center"/>Mi Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => navigate('/mipedido')}><Bag size={20} className="mx-2"/>Mi Pedido</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => navigate('/historialpedido')}><Receipt size={20} className="mx-2"/>Historial de Pedidos</NavDropdown.Item>
                <NavDropdown.Divider />
                {permission !== UserRole.Cliente && (
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