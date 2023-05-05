import Table from 'react-bootstrap/Table';
import "./table.css"
import {LockFill, PencilFill, UnlockFill} from "react-bootstrap-icons";
//Tablas administrativas [EMPLEADOS, USUARIOS, RUBRO INGREDIENTE, RUBRO PRODUCTO, INGREDIENTES, PRODUCTOS]
export const TableNormal = () => {
 return(
        <Table responsive>
            <thead>
            <tr className="encabezado">
                <th>Head 1</th>
                <th>Head 2</th>
                <th>Head 3</th>
                <th>Head 4</th>
                <th>Head 5</th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
                <td>Cell 3</td>
                <td>Cell 4</td>
                <td>Cell 5</td>
                <td><PencilFill color="#FBC02D" size={24}/></td>
                <td><LockFill color="#D32F2F" size={24}/></td>
            </tr>
            <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
                <td>Cell 3</td>
                <td>Cell 4</td>
                <td>Cell 5</td>
                <td><PencilFill color="#FBC02D" size={24}/></td>
                <td><UnlockFill color="#34A853" size={24}/></td>
            </tr>
            <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
                <td>Cell 3</td>
                <td>Cell 4</td>
                <td>Cell 5</td>
                <td><PencilFill color="#FBC02D" size={24}/></td>
                <td><LockFill color="#D32F2F" size={24}/></td>
            </tr>
            <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
                <td>Cell 3</td>
                <td>Cell 4</td>
                <td>Cell 5</td>
                <td><PencilFill color="#FBC02D" size={24}/></td>
                <td><LockFill color="#D32F2F" size={24}/></td>
            </tr>
            <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
                <td>Cell 3</td>
                <td>Cell 4</td>
                <td>Cell 5</td>
                <td><PencilFill color="#FBC02D" size={24}/></td>
                <td><UnlockFill color="#34A853" size={24}/></td>
            </tr>
            </tbody>
        </Table>
 )
}