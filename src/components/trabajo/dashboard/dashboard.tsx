import {Nav, Tab, Col, Row, Container} from "react-bootstrap";
import {PersonCircle} from "react-bootstrap-icons";
import "./dashboard.css"
import {EmployeesTable} from "../menus/employees/employeesTable.tsx";
import {CategoriesTable} from "../menus/categories/categoriesTable";
import {CustomersTable} from "../menus/customers/customersTable.tsx";
//import {TableTest} from "../menus/testModal/tableTest.tsx";

export const DashBoard = () => {

    return (
        <Container fluid className="containerDB mt-5 mb-5 mx-2">
        <Tab.Container defaultActiveKey="Principal">
            <Row className="w-100">
                <Col sm={3} style={{ maxWidth: "fit-content"}}>
                    <div className="p-2 text-center userinfoDB">
                        <div>
                            <PersonCircle size={52} color={"#D32F2F"} className="mb-3"/>
                        </div>
                        <div className="mb-3">
                            <div>Nombre Apellido</div>
                        </div>
                        <div className="text-danger fw-bold mb-3">Admin</div>
                    </div>
                    <Nav variant="pills" className="flex-column" style={{ maxWidth: "fit-content", position: "sticky", top: "80px"}}>
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
                <Col>
                    <div className="row">
                        <Tab.Content>
                            <Tab.Pane eventKey="Principal">
                                <div className="col">Principal</div>
                                {/*<TableTest/>*/}
                            </Tab.Pane>
                            <Tab.Pane eventKey="Empleados">
                                <EmployeesTable/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Clientes">
                                <CustomersTable/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Rubros">
                                {<CategoriesTable/>}
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
