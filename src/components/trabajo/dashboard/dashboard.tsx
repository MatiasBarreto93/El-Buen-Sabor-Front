import {Nav, Tab, Col, Row, Container} from "react-bootstrap";
import {PersonCircle} from "react-bootstrap-icons";
import "./dashboard.css"
import {EmployeesTable} from "../menus/employees/employeesTable.tsx";
import {CategoriesTable} from "../menus/categories/categoriesTable";
import {CustomersTable} from "../menus/customers/customersTable.tsx";
import {IngredientsTable} from "../menus/ingredients/ingredientsTable";
import {TableTest} from "../menus/testModal/tableTest.tsx";
import {ProductsTable} from "../menus/products/productsTable";
import {StockTable} from "../menus/stock/stockTable.tsx";
import {useState} from "react";
import {DrinksTable} from "../menus/drinks/drinksTable";

export const DashBoard = () => {

    const [activeKey, setActiveKey] = useState("Principal");

    const handleSelect = (selectedKey:string | null) => {
        if (selectedKey){
        setActiveKey(selectedKey);
        }
    }
    
    return (
        <Container fluid className="containerDB mt-5 mb-5 mx-2">
        <Tab.Container defaultActiveKey="Principal" activeKey={activeKey} onSelect={handleSelect}>
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
                            <Nav.Link eventKey="Bebidas" className="navLinkDB">Bebidas</Nav.Link>
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
                            {activeKey === "Principal" && (
                            <Tab.Pane eventKey="Principal">
                                <TableTest/>
                            </Tab.Pane>
                            )}
                            {activeKey === "Empleados" && (
                            <Tab.Pane eventKey="Empleados">
                                <EmployeesTable/>
                            </Tab.Pane>
                            )}
                            {activeKey === "Clientes" && (
                            <Tab.Pane eventKey="Clientes">
                                <CustomersTable/>
                            </Tab.Pane>
                            )}
                            {activeKey === "Rubros" && (
                            <Tab.Pane eventKey="Rubros">
                                {<CategoriesTable/>}
                            </Tab.Pane>
                            )}
                            {activeKey === "Ingredientes" && (
                            <Tab.Pane eventKey="Ingredientes">
                                {<IngredientsTable/>}
                            </Tab.Pane>
                            )}
                            {activeKey === "Productos" && (
                            <Tab.Pane eventKey="Productos">
                                {<ProductsTable/>}
                            </Tab.Pane>
                            )}
                            {activeKey === "Bebidas" && (
                                <Tab.Pane eventKey="Bebidas">
                                    {<DrinksTable/>}
                                </Tab.Pane>
                            )}
                            {activeKey === "Stock" && (
                            <Tab.Pane eventKey="Stock">
                                {<StockTable/>}
                            </Tab.Pane>
                            )}
                            {activeKey === "Movimientos" && (
                            <Tab.Pane eventKey="Movimientos">
                                <p>Movimientos</p>
                            </Tab.Pane>
                            )}
                        </Tab.Content>
                    </div>
                </Col>
            </Row>
        </Tab.Container>
        </Container>
    );
};
