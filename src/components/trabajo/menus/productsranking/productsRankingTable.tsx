import {useGenericGet} from "../../../../services/useGenericGet";
import {ItemSales} from "../../../../interfaces/itemSales";
import {useState} from "react";
import {Table, ToggleButton, ToggleButtonGroup} from "react-bootstrap";

export const ProductsRankingTable = () => {

    const data = useGenericGet<ItemSales>("orders/itemsRanking", "Ranking productos")
    const [selectedItemType, setSelectedItemType] = useState(1);

    const handleToggle = (selectedValue: number) => {
        setSelectedItemType(selectedValue);
    };

    return(
        <>
            <h5 className="encabezado mb-3">Ranking Ventas</h5>
            <div className="d-flex justify-content-between">
                <ToggleButtonGroup type="radio" name={"options"} defaultValue={1} onChange={handleToggle}>
                    <ToggleButton id="tbg-radio-1" value={1} className={`toggle-button ${selectedItemType === 1 ? 'active' : ''}`}>
                        Productos
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value={2} className={`toggle-button ${selectedItemType === 2 ? 'active' : ''}`}>
                        Bebidas
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <Table hover>
                <thead>
                <tr className="encabezado">
                    <th>Nombre</th>
                    <th>Cantidad Vendida</th>
                </tr>
                </thead>
                <tbody>
                    {data
                        .filter((itemSale) => itemSale.itemTypeId === selectedItemType)
                        .map((itemSale) => (
                            <tr key={itemSale.id}>
                                <td>{itemSale.name}</td>
                                <td>{itemSale.totalQuantitySold}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </>
    )
}