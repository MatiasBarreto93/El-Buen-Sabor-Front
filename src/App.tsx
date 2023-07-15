import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {lazy, Suspense, useState} from "react";
import {Loader} from "./components/Loader/loader.tsx";
import {EmployeeSignUp} from "./components/Auth0/EmployeeSignUp.tsx";

const Home = lazy(() => import("./components/home/home.tsx"));
const MiPedido = lazy(() => import("./components/mipedido/MiPedido.tsx"));
const MiPerfil = lazy(() => import("./components/miperfil/MiPerfil.tsx"));
const Trabajo = lazy(() => import("./components/trabajo/trabajo.tsx"));

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
          <Suspense fallback={<Loader/>}>
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/miperfil" element={<MiPerfil />}/>
                  <Route path="/mipedido" element={<MiPedido />}/>
                  <Route path="/historialpedido"/>
                  <Route path="/trabajo" element={<Trabajo />}/>
              </Routes>
          </Router>
          </Suspense>
      </>
  )
}

