import './header.css';
import "../../styles/botones.css"
import {Button, Container, Form, Navbar} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";
import {DropDownMenu} from "./dropDownMenu.tsx";
import {LogInButton} from "./logInButton.tsx";

export const Header = () => {

    const {isAuthenticated} = useAuth0()

    return (
        <Navbar expand="lg">
            <Container fluid>
                <div className="d-flex mx-2">
                    <img alt={"logo"} src={"/img/imgnavbar.png"} height="50"/>
                    <Navbar.Brand href="/" className="mx-2">El Buen Sabor</Navbar.Brand>
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
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
