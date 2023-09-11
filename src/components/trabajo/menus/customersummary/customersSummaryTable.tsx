import {Button, Table} from "react-bootstrap";
import DatePicker from "react-datepicker";
import {exportTableDataToExcel} from "../../../../util/exportTableDataToExcel.ts";
import {CaretDownFill, CaretUpFill, FiletypeXlsx} from "react-bootstrap-icons";
import {useEffect, useState} from "react";
import {useGenericGetDate} from "../../../../services/useGenericGetDate.ts";
import {CustomerSummary} from "../../../../interfaces/customerSummary.ts";
import {useNavigate} from "react-router-dom";

export const CustomersSummaryTable = () => {

    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1))

    const data = useGenericGetDate<CustomerSummary>("orders/customerRanking", "Ranking productos", startDate, endDate);
    const [clientRank, setclientRank] = useState<CustomerSummary[]>([]);

    const navigate = useNavigate();
    const handleClick = (id: number) => {
        navigate(`/customer-orders-history/${id}`);
    }

    useEffect(() => {
        setclientRank(data);
    }, [data]);

    //Sort Table
    const [sortState, setSortState] = useState<{ column: string, direction: string }>({
        column: 'id',
        direction: 'asc'
    });

    //almacena el estado actual de las columnas de la tabla que pueden ser ordenadas, y su dirección de ordenación actual.
    const [sortableColumns, setSortableColumns] = useState<{ [key: string]: string }>({
        orderCount: 'asc',
        totalOrderAmount: 'asc'
    });

    //Al hacer click en la col se encarga de cambiar la dirección a su contraparte si es "asc" cambia a "desc"
    const handleSort = (column: string) => {
        const newDirection = sortableColumns[column] === 'asc' ? 'desc' : 'asc';
        const newSortableColumns = { ...sortableColumns, [column]: newDirection };
        setSortableColumns(newSortableColumns);
        setSortState({ column, direction: newDirection });
    };

    //Este código crea una variable llamada sortedData que es una versión ordenada de la variable clientRank,
    const sortedData = [...clientRank].sort((a: CustomerSummary, b: CustomerSummary) => {
        //devuelve 0 si aun no se hizo click en ninguna col (nulo)
        if (sortState.column === null) {
            return 0;
        }
        const aValue = a[sortState.column as keyof CustomerSummary];
        const bValue = b[sortState.column as keyof CustomerSummary];
        //devuelve 0 si son iguales despues de comparar
        if (aValue === bValue) {
            return 0;
        }
        //devuelve 1 si la dirección es ascendente (asc) y -1 si la dirección es descendente (desc).
        let result: number;
        if (sortState.direction === 'asc') {
            result = aValue < bValue ? -1 : 1;
        } else {
            result = aValue > bValue ? -1 : 1;
        }
        return result;
    });

    //Se encarga de renderizar los iconos de la columna correspondiente, dependiendo del tipo de ordenamiento
    const renderSortIcon = (column: string) => {
        const icon = sortableColumns[column] === 'asc' ? <CaretUpFill color={"#D32F2F"}/> : <CaretDownFill color={"#D32F2F"}/>;
        return sortState.column === column ? icon : <CaretUpFill color={"#D32F2F"}/>;
    };

    return(
        <>
            <h5 className="encabezado mb-3">Ranking Clientes</h5>
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <div className="d-flex">
                        <h5 className="mx-3">Desde:</h5>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date as Date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            locale="es"
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div className="d-flex">
                        <h5 className="mx-3">Hasta:</h5>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date as Date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            locale="es"
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </div>
                <div>
                    <Button variant="success"
                            onClick={() => exportTableDataToExcel<CustomerSummary>(clientRank, "RankingClientes")}>
                        <FiletypeXlsx size={24}/> Exportar a Excel
                    </Button>
                </div>
            </div>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Nombre Apellido</th>
                    <th onClick={() => handleSort("orderCount")}>Cantidad Ordenes{renderSortIcon('orderCount')}</th>
                    <th onClick={() => handleSort("totalOrderAmount")}>Total Ordenes{renderSortIcon('totalOrderAmount')}</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {sortedData.map((cli) => (
                        <tr key={cli.customerId}>
                            <td>{cli.customerName} {cli.customerLastName}</td>
                            <td>{cli.orderCount}</td>
                            <td>${cli.totalOrderAmount}</td>
                            <td><Button onClick={() => handleClick(cli.customerId)}>Ver Pedidos</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}