import {Cart2} from "react-bootstrap-icons";
import {useCart} from "../../context/cart/CartContext.tsx";
import {useNavigate} from "react-router-dom";
import './shopCart.css'

export const ShopCart = () => {

    const {items} = useCart();
    const navigate = useNavigate();
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="shop-cart" onClick={() => navigate('/mipedido')}>
            <Cart2
                size={28}
                className="shop-cart-icon"
                onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
                onMouseLeave={() => {document.body.style.cursor = 'default'}}
            />
            <span className="shop-cart-count">{totalItems}</span>
        </div>
    )
}