import {useGenericGet} from "../../../../services/useGenericGet";
import {ItemSales} from "../../../../interfaces/itemSales";
import {useState} from "react";

export const CustomersSummaryTable = () => {
    const data = useGenericGet<ItemSales>("orders/customerRanking", "Ranking clientes")
    const [orderType, setOrderType] = useState(1);

    return(
        <>
            <h5 className="encabezado mb-3">Ranking Clientes</h5>

        </>
    )

}