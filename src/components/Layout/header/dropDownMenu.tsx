import {useAuth0} from "@auth0/auth0-react";
import {NavDropdown} from "react-bootstrap";
import {Bag, Bicycle, Cash, EggFried, Person, Power, Receipt, Shop} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";
import {UserRole} from "../../../interfaces/UserRole.ts";
import secureLS from "../../../util/secureLS.ts";
import {UnlockAccess} from "../../../util/unlockAccess.tsx";

export const DropDownMenu = () =>{

    const navigate = useNavigate();
    const { user, logout } = useAuth0();

    const handleLogout = () => {
        localStorage.setItem('firstRender', JSON.stringify(true));
        localStorage.removeItem('cartItems');
        localStorage.removeItem('/')
        secureLS.clear();
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    return (
        <div className="d-flex">
            <NavDropdown title={user?.name} id="navbarScrollingDropdown" className="navUserMenuContainer p-2">
                <NavDropdown.Item onClick={() => navigate('/miperfil')}><Person size={20} className="mx-2 align-content-center"/>Mi Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => navigate('/mipedido')}><Bag size={20} className="mx-2"/>Mi Pedido</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => navigate('/historialpedido')}><Receipt size={20} className="mx-2"/>Historial de Pedidos</NavDropdown.Item>
                <NavDropdown.Divider />

                <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                    <NavDropdown.Item onClick={() => navigate('/admin')}><Shop size={20} className="mx-2"/>Administración </NavDropdown.Item>
                    <NavDropdown.Divider />
                </UnlockAccess>

                <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                    <NavDropdown.Item onClick={() => navigate('/cocina')}><EggFried size={20} className="mx-2"/>Cocina </NavDropdown.Item>
                    <NavDropdown.Divider />
                </UnlockAccess>

                <UnlockAccess request={[UserRole.Admin, UserRole.Cajero]}>
                    <NavDropdown.Item onClick={() => navigate('/cajero')}><Cash size={20} className="mx-2"/>Caja</NavDropdown.Item>
                    <NavDropdown.Divider />
                </UnlockAccess>

                <UnlockAccess request={[UserRole.Admin, UserRole.Repartidor]}>
                    <NavDropdown.Item onClick={() => navigate('/delivery')}><Bicycle size={20} className="mx-2"/>Delivery</NavDropdown.Item>
                    <NavDropdown.Divider />
                </UnlockAccess>

                <NavDropdown.Item onClick={() => handleLogout()} className="text-danger"><Power size={20} color={"red"} className="mx-2"/>Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
        </div>
    )
}