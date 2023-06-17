import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Home} from "./components/home/home.tsx";
import {Trabajo} from "./components/trabajo/trabajo.tsx";
import {Auth0UserSignUp} from "./components/Auth0/Auth0UserSignUp.tsx";
import {useState} from "react";

export function App() {

    //Inicializar una variable con un valor obtenido del almacenamiento local, o true si no hay ningún valor almacenado.
    const [firtsRender, setFirtsRender] = useState(() => {
        const persistedFirstRender = localStorage.getItem('firstRender');
        return persistedFirstRender !== null ? JSON.parse(persistedFirstRender) : true;
    });

  return (
      <>
          <ToastContainer/>
          {firtsRender ? <Auth0UserSignUp firstRender={firtsRender} setFirstRender={setFirtsRender}/> : null}
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/mipedido"/>
                  <Route path="/historialpedido"/>
                  <Route path="/trabajo" element={<Trabajo />}/>
              </Routes>
          </Router>
      </>
  )
}

