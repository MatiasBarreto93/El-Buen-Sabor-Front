import {useAuth0} from "@auth0/auth0-react";
import {NavDropdown} from "react-bootstrap";
import {Person, Bag, Shop, Power, Cart2, Receipt} from "react-bootstrap-icons";

export const DropDownMenu = () =>{

    const { user ,logout} = useAuth0()

    const handleLogout = () => {
        localStorage.setItem('firstRender', JSON.stringify(true));
        logout({logoutParams: {returnTo: window.location.origin}})
    }
    
    return (
        <div className="d-flex">
            <NavDropdown title={user?.name} id="navbarScrollingDropdown" className="navUserMenuContainer p-2">
                <NavDropdown.Item href="/miperfil"><Person size={20} className="mx-2 align-content-center"/>Mi Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/mipedido"><Bag size={20} className="mx-2"/>Mi Pedido</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/historialpedido"><Receipt size={20} className="mx-2"/>Historial de Pedidos</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/trabajo"><Shop size={20} className="mx-2"/>Trabajo</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleLogout()} className="text-danger"><Power size={20} color={"red"} className="mx-2"/>Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
            <div className="d-flex">
                <Cart2 size={28} className="mt-1 mx-2" />
                <span className="badge badge-pill bg-danger mt-2 mb-3">3</span>
            </div>
        </div>
    )
}