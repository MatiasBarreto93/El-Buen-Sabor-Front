import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {lazy, Suspense, useState} from "react";
import {Loader} from "./components/Loader/loader.tsx";
import {EmployeeSignUp} from "./components/Auth0/EmployeeSignUp.tsx";
import {Container} from "react-bootstrap";

const Header = lazy(() => import("./components/Layout/header/header.tsx"));
const Footer = lazy(() => import("./components/Layout/footer/footer.tsx"));
const Router =lazy(() => import("./routes/Router.tsx"));

export function App() {

    //Inicializar una variable con un valor obtenido del almacenamiento local, o true si no hay ningún valor almacenado.
    const [firtsRender, setFirtsRender] = useState(() => {
        const persistedFirstRender = localStorage.getItem('firstRender');
        return persistedFirstRender !== null ? JSON.parse(persistedFirstRender) : true;
    });

    return (
        <>
            <ToastContainer/>
            {firtsRender ? <EmployeeSignUp firstRender={firtsRender} setFirstRender={setFirtsRender}/> : null}
            <Header/>
            <Container style={{minHeight: '70vh', minWidth: '100%', padding: '0'}}>
                <Suspense fallback={<Loader/>}>
                    <Router/>
                </Suspense>
            </Container>
            <Footer/>
        </>
    )
}

