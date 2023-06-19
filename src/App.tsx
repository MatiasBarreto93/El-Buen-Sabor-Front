import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Home} from "./components/home/home.tsx";
import {Trabajo} from "./components/trabajo/trabajo.tsx";
import {EmployeeSignUp} from "./components/Auth0/EmployeeSignUp.tsx";
import {useState} from "react";
import {MiPedido} from "./components/mipedido/MiPedido.tsx";
import {MiPerfil} from "./components/miperfil/MiPerfil.tsx";

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
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/miperfil" element={<MiPerfil />}/>
                  <Route path="/mipedido" element={<MiPedido />}/>
                  <Route path="/historialpedido"/>
                  <Route path="/trabajo" element={<Trabajo />}/>
              </Routes>
          </Router>
      </>
  )
}

