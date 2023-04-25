import './header.css';
import "../styles/botones.css"
import {Button, Container, Form, Navbar} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";
import {DropDownMenu} from "./userDropDown";
import {LogInButton} from "./logInButton";

export const Header = () => {

    const {isAuthenticated} = useAuth0()

    return (
        <Navbar expand="lg">
            <Container fluid>
                {/*Logo y Nombre*/}
                <div className="d-flex mx-2">
                    <img alt={"logo"} src={"/img/imgnavbar.png"} height="50"/>
                    <Navbar.Brand href="#" className="mx-2">El Buen Sabor</Navbar.Brand>
                </div>
                {/*Elementos a colapsar */}
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    {/*Barra de Busqueda*/}
                    <div className="d-flex w-100 search-bar-container">
                        <Form className="d-flex w-100">
                            <Form.Control type="search" placeholder="Buscar" aria-label="Buscar" className="mx-2" />
                            <Button variant="outline-success" className="mx-2">Buscar</Button>
                        </Form>
                    </div>
                    {/* NavBar Derecha */}
                    <div className="d-flex mx-2">
                        {/*Normal*/}
                        {isAuthenticated ? <DropDownMenu/> : <LogInButton/>}
                        {/*test*/}
                        {/*{isAuthenticated ?  <LogInButton/> : <DropDownMenu/>}*/}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
