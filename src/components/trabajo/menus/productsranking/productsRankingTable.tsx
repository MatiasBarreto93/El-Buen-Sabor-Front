import {ItemSales} from "../../../../interfaces/itemSales";
import {useEffect, useState} from "react";
import {Button, Table, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useGenericGetDate} from "../../../../services/useGenericGetDate.ts";
import es from 'date-fns/locale/es';
import {FiletypeXlsx} from "react-bootstrap-icons";
import {exportTableDataToExcel} from "../../../../util/exportTableDataToExcel.ts";
registerLocale('es', es)

export const ProductsRankingTable = () => {

    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1))

    const data = useGenericGetDate<ItemSales>("orders/itemsRanking", "Ranking productos", startDate, endDate);
    const [producRank, setproducRank] = useState<ItemSales[]>([]);

    useEffect(() => {
        setproducRank(data);
    }, [data]);

    const [selectedItemType, setSelectedItemType] = useState(2);
    const handleToggle = (selectedValue: number) => {
        setSelectedItemType(selectedValue);
    };

    return(
        <>
            <h5 className="encabezado mb-3">Ranking Ventas</h5>
            <div className="d-flex justify-content-between">
                <ToggleButtonGroup type="radio" name={"options"} defaultValue={1} onChange={handleToggle}>
                    <ToggleButton id="tbg-radio-1" value={2} className={`toggle-button ${selectedItemType === 2 ? 'active' : ''}`}>
                        Productos
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value={3} className={`toggle-button ${selectedItemType === 3 ? 'active' : ''}`}>
                        Bebidas
                    </ToggleButton>
                </ToggleButtonGroup>
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
                            onClick={() => exportTableDataToExcel<ItemSales>(producRank, "RankingProductos")}>
                        <FiletypeXlsx size={24}/> Exportar a Excel
                    </Button>
                </div>
            </div>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Nombre</th>
                    <th>Cantidad Vendida</th>
                </tr>
                </thead>
                <tbody>
                    {producRank.filter((itemSale) => itemSale.itemTypeId === selectedItemType)
                        .map((itemSale) => (
                            <tr key={itemSale.id}>
                                <td>{itemSale.itemName}</td>
                                <td>{itemSale.totalQuantitySold}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </>
    )
}