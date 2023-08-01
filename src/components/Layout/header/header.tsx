import './header.css';
import "../../styles/botones.css"
import {Button, Form, Navbar} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";
import {DropDownMenu} from "./dropDownMenu.tsx";
import {LogInButton} from "./logInButton.tsx";
import {ShopCart} from "../../cart/shopCart.tsx";
import {useNavigate} from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();
    const {isAuthenticated} = useAuth0()

    return (
        <Navbar expand="lg" style={{paddingLeft: '24px', paddingRight: '24px'}}>
            <div className="d-flex mx-2">
                <img alt={"logo"} src={"/img/imgnavbar.png"} height="50"/>
                <Navbar.Brand
                    onClick={() => navigate('/')}
                    className="mx-2"
                    onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
                    onMouseLeave={() => {document.body.style.cursor = 'default'}}
                >El Buen Sabor</Navbar.Brand>
            </div>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <div className="d-flex w-100 search-bar-container">
                    <Form className="d-flex w-100">
                        <Form.Control type="search" placeholder="Buscar" aria-label="Buscar" className="mx-2" />
                        <Button variant="outline-success" className="mx-2">Buscar</Button>
                    </Form>
                </div>
                <div className="d-flex mx-2">
                    {isAuthenticated ? <DropDownMenu/> : <LogInButton/>}
                    <ShopCart/>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
