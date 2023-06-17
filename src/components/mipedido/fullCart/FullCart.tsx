import {Form, Table} from "react-bootstrap";
import './../../styles/table.css'
import { Trash3Fill} from "react-bootstrap-icons";
import Accordion from 'react-bootstrap/Accordion';
export const FullCart = () => {

    return(
        <Form>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>img</td>
                    <td>prod</td>
                    <td>cant</td>
                    <td>pre</td>
                    <td>Cantidad</td>
                    <td>
                        <Trash3Fill
                            color='#D32F2F'
                            size={24}
                            //onClick
                            onMouseEnter={() => {document.body.style.cursor = 'pointer'}}
                            onMouseLeave={() => {document.body.style.cursor = 'default'}}
                        />
                    </td>
                </tr>
                </tbody>
            </Table>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Accordion Item #1</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Form>
    )
}