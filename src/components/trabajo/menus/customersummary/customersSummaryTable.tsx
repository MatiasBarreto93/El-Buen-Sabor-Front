import {Button, Table} from "react-bootstrap";
import DatePicker from "react-datepicker";
import {exportTableDataToExcel} from "../../../../util/exportTableDataToExcel.ts";
import {FiletypeXlsx} from "react-bootstrap-icons";
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
                    <th>Cantidad Ordenes</th>
                    <th>Total Ordenes</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {clientRank.map((cli) => (
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