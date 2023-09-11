import {useEffect, useState} from "react";
import {useGenericGetDate} from "../../../../services/useGenericGetDate";
import {MonetaryMovements} from "../../../../interfaces/monetaryMovements";
import DatePicker from "react-datepicker";
import {exportTableDataToExcel} from "../../../../util/exportTableDataToExcel";
import {Button, Table} from "react-bootstrap";
import {FiletypeXlsx} from "react-bootstrap-icons";

export const MonetaryMovementsTable = () => {
    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1))
    const data = useGenericGetDate <MonetaryMovements>("orders/monetaryMovements", "Movimientos Monetarios", startDate, endDate);

    const [monetaryMovements, setMonetaryMovements] = useState<MonetaryMovements[]>([]);

    useEffect(() => {
        if (Array.isArray(data)) {
            setMonetaryMovements(data);
        } else {
            setMonetaryMovements([data]);
        }
    }, [data]);

    return(
        <>
            <h5 className="encabezado mb-3">Movimientos Monetarios</h5>
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
                            onClick={() => exportTableDataToExcel<MonetaryMovements>(monetaryMovements, "Movimientos Monetarios")}>
                        <FiletypeXlsx size={24}/> Exportar a Excel
                    </Button>
                </div>
            </div>
            <Table>
                <thead>
                <tr className="encabezado">
                    <th>Ingresos</th>
                    <th>Costos</th>
                    <th>Ganancias</th>
                </tr>
                </thead>
                <tbody>
                    {monetaryMovements.map((movement, index) => (
                        <tr key={index}>
                            <td>{movement.income}</td>
                            <td>{movement.expenses}</td>
                            <td>{movement.profits}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}