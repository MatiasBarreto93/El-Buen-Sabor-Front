import {useState} from "react";
import {Nav, Tab, Col, Row, Container, Button} from "react-bootstrap";
import "./dashboard.css"
import {PersonCircle, ChevronBarLeft, ChevronBarRight} from "react-bootstrap-icons";

export const DashBoard = () => {

    const [showOptions, setShowOptions] = useState(true);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    }

    return (
        <Container fluid className="containerDB mt-5 mb-5">
            <Button variant="outline-primary" onClick={toggleOptions} className="mb-3 mt-5">
                {showOptions ? <ChevronBarLeft size={24}/> : <ChevronBarRight size={24}/>}
            </Button>
        <Tab.Container defaultActiveKey="Principal">
            <Row>
                <Col sm={3} style={{ maxWidth: "fit-content" }} className={showOptions ? "" : "d-none"}>
                    <div className="p-2 text-center userinfoDB">
                        <div>
                            <PersonCircle size={52} color={"#D32F2F"} className="mb-3"/>
                        </div>
                        <div className="mb-3">
                            <div>Nombre Apellido</div>
                        </div>
                        <div className="text-danger fw-bold mb-3">Admin</div>
                    </div>
                    <Nav variant="pills" className="flex-column" style={{ maxWidth: "fit-content" }}>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Principal" className="navLinkDB">Principal</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Empleados" className="navLinkDB">Empleados</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Clientes" className="navLinkDB">Clientes</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Rubros" className="navLinkDB">Rubros</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Ingredientes" className="navLinkDB">Ingredientes</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Productos" className="navLinkDB">Productos</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Stock" className="navLinkDB">Stock</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Movimientos" className="navLinkDB">Movimientos Monetarios</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col sm={9}>
                    <div className="row">
                        <Tab.Content style={{ maxWidth: "fit-content" }}>
                            <Tab.Pane eventKey="Principal">
                                <div className="col">
                                    <p>Principal</p>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Empleados">
                                <p className="d-flex w-100">Empleados</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Clientes">
                                <p>Clientes</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Rubros">
                                <p>Rubros</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Ingredientes">
                                <p>Ingredientes</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Productos">
                                <p>Productos</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Stock">
                                <p>Stock</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Movimientos">
                                <p>Movimientos</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </Col>
            </Row>
        </Tab.Container>
        </Container>
    );
};
