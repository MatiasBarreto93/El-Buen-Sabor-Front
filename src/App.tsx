import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {lazy, Suspense, useState} from "react";
import {Loader} from "./components/Loader/loader.tsx";
import {EmployeeSignUp} from "./components/Auth0/EmployeeSignUp.tsx";
import {CartProvider} from "./context/cart/CartContext.tsx";
import {BrowserRouter as Router} from "react-router-dom";
import {UserPermissionProvider} from "./context/permission/UserPermission.tsx";
import {Container} from "react-bootstrap";
import {SearchProvider} from "./context/search/SearchContext.tsx";

const Header = lazy(() => import("./components/Layout/header/header.tsx"));
const Footer = lazy(() => import("./components/Layout/footer/footer.tsx"));
const Routes =lazy(() => import("./routes/Router.tsx"));

export function App() {

    //Inicializar una variable con un valor obtenido del almacenamiento local, o true si no hay ningún valor almacenado.
    const [firtsRender, setFirtsRender] = useState(() => {
        const persistedFirstRender = localStorage.getItem('firstRender');
        return persistedFirstRender !== null ? JSON.parse(persistedFirstRender) : true;
    });

    return (
        <>
            <Router>
                <UserPermissionProvider>
                    <SearchProvider>
                    <CartProvider>
                        <ToastContainer/>
                        {firtsRender ? <EmployeeSignUp firstRender={firtsRender} setFirstRender={setFirtsRender}/> : null}
                        <Header/>
                        <Container style={{minHeight: '63vh', minWidth: '100%', padding: '0'}}>
                            <Suspense fallback={<Loader/>}>
                                <Routes/>
                            </Suspense>
                        </Container>
                        <Footer/>
                    </CartProvider>
                    </SearchProvider>
                </UserPermissionProvider>
            </Router>
        </>
    )
}

