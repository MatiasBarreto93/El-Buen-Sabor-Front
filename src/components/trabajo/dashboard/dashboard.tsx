import {Col, Container, Nav, Row, Tab} from "react-bootstrap";
import {PersonCircle} from "react-bootstrap-icons";
import "./dashboard.css"
import {EmployeesTable} from "../menus/employees/employeesTable.tsx";
import {CategoriesTable} from "../menus/categories/categoriesTable";
import {CustomersTable} from "../menus/customers/customersTable.tsx";
import {IngredientsTable} from "../menus/ingredients/ingredientsTable";
import {TableTest} from "../menus/testModal/tableTest.tsx";
import {ProductsTable} from "../menus/products/productsTable";
import {StockTable} from "../menus/stock/stockTable.tsx";
import {useEffect, useState} from "react";
import {UnlockAccess} from "./unlockAccess.tsx";
import {UserRole} from "../../../interfaces/UserRole.ts";
import {useUserPermission} from "../../../context/permission/UserPermission.tsx";
import {useGetCustomer} from "../../../services/useGetCustomer.ts";
import {useAuth0} from "@auth0/auth0-react";
import {useInitializeCustomer} from "../menus/employees/hooks/useInitializeCustomer.ts";

export const DashBoard = () => {

    const getCustomer = useGetCustomer();
    const {user} = useAuth0();
    const [cliente, setCliente ] = useInitializeCustomer(undefined);

    const { permission } = useUserPermission();

    const [activeKey, setActiveKey] = useState("Principal");
    const handleSelect = (selectedKey:string | null) => {
        if (selectedKey){
        setActiveKey(selectedKey);
        }
    }

    useEffect(() => {
        if (user?.sub) {
            getCustomer(user.sub)
                .then((customer) => {
                    setCliente(customer);
                })
                .catch((error) => {
                    console.error("Error fetching customer data:", error);
                });
        }
    }, [user?.sub]);

    return (
        <Container fluid className="containerDB mt-5 mb-5 mx-2">
        <Tab.Container defaultActiveKey="Principal" activeKey={activeKey} onSelect={handleSelect}>
            <Row className="w-100">
                <Col sm={3} style={{ width: "200px"}}>
                    <div className="p-2 text-center userinfoDB">
                        <div>
                            <PersonCircle size={52} color={"#D32F2F"} className="mb-3"/>
                        </div>
                        <div className="mb-3">
                            <div>{cliente.name} {cliente.lastname}</div>
                        </div>
                        <div className="text-danger fw-bold mb-3">{permission}</div>
                    </div>
                    <Nav variant="pills" className="flex-column" style={{ position: "sticky", top: "80px"}}>

                        <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                            <Nav.Item className="navItemDB">
                                <Nav.Link eventKey="Principal" className="navLinkDB">Principal</Nav.Link>
                            </Nav.Item>
                        </UnlockAccess>

                        <UnlockAccess request={[UserRole.Admin]}>
                            <Nav.Item className="navItemDB">
                                <Nav.Link eventKey="Empleados" className="navLinkDB">Empleados</Nav.Link>
                            </Nav.Item>
                        </UnlockAccess>

                        <UnlockAccess request={[UserRole.Admin]}>
                            <Nav.Item className="navItemDB">
                                <Nav.Link eventKey="Clientes" className="navLinkDB">Clientes</Nav.Link>
                            </Nav.Item>
                        </UnlockAccess>

                        <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                            <Nav.Item className="navItemDB">
                                <Nav.Link eventKey="Rubros" className="navLinkDB">Rubros</Nav.Link>
                            </Nav.Item>
                        </UnlockAccess>

                        <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                            <Nav.Item className="navItemDB">
                                <Nav.Link eventKey="Ingredientes" className="navLinkDB">Ingredientes</Nav.Link>
                            </Nav.Item>
                        </UnlockAccess>

                        <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                            <Nav.Item className="navItemDB">
                                <Nav.Link eventKey="Productos" className="navLinkDB">Productos</Nav.Link>
                            </Nav.Item>
                        </UnlockAccess>

                        <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                            <Nav.Item className="navItemDB">
                                <Nav.Link eventKey="Bebidas" className="navLinkDB">Bebidas</Nav.Link>
                            </Nav.Item>
                        </UnlockAccess>

                        <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                            <Nav.Item className="navItemDB">
                                <Nav.Link eventKey="Stock" className="navLinkDB">Stock</Nav.Link>
                            </Nav.Item>
                        </UnlockAccess>

                        <UnlockAccess request={[UserRole.Admin]}>
                            <Nav.Item className="navItemDB">
                                <Nav.Link eventKey="Movimientos" className="navLinkDB">Movimientos Monetarios</Nav.Link>
                            </Nav.Item>
                        </UnlockAccess>

                    </Nav>
                </Col>
                <Col>
                    <div className="row">
                        <Tab.Content>

                            <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                                {activeKey === "Principal" && (
                                    <Tab.Pane eventKey="Principal">
                                        <TableTest/>
                                    </Tab.Pane>
                                )}
                            </UnlockAccess>

                            <UnlockAccess request={[UserRole.Admin]}>
                                {activeKey === "Empleados" && (
                                    <Tab.Pane eventKey="Empleados">
                                        <EmployeesTable/>
                                    </Tab.Pane>
                                )}
                            </UnlockAccess>

                            <UnlockAccess request={[UserRole.Admin]}>
                                {activeKey === "Clientes" && (
                                    <Tab.Pane eventKey="Clientes">
                                        <CustomersTable/>
                                    </Tab.Pane>
                                )}
                            </UnlockAccess>

                            <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                                {activeKey === "Rubros" && (
                                    <Tab.Pane eventKey="Rubros">
                                        {<CategoriesTable/>}
                                    </Tab.Pane>
                                )}
                            </UnlockAccess>

                            <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                                {activeKey === "Ingredientes" && (
                                    <Tab.Pane eventKey="Ingredientes">
                                        {<IngredientsTable/>}
                                    </Tab.Pane>
                                )}
                            </UnlockAccess>

                            <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                                {activeKey === "Productos" && (
                                    <Tab.Pane eventKey="Productos">
                                        {<ProductsTable/>}
                                    </Tab.Pane>
                                )}
                            </UnlockAccess>

                            <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                                {activeKey === "Bebidas" && (
                                    <Tab.Pane eventKey="Bebidas">
                                        <p>Bebidas</p>
                                    </Tab.Pane>
                                )}
                            </UnlockAccess>

                            <UnlockAccess request={[UserRole.Admin, UserRole.Cocinero]}>
                                {activeKey === "Stock" && (
                                    <Tab.Pane eventKey="Stock">
                                        {<StockTable/>}
                                    </Tab.Pane>
                                )}
                            </UnlockAccess>

                            <UnlockAccess request={[UserRole.Admin]}>
                                {activeKey === "Movimientos" && (
                                    <Tab.Pane eventKey="Movimientos">
                                        <p>Movimientos</p>
                                    </Tab.Pane>
                                )}
                            </UnlockAccess>

                        </Tab.Content>
                    </div>
                </Col>
            </Row>
        </Tab.Container>
        </Container>
    );
};
