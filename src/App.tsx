import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Home} from "./components/home/home.tsx";
import {Trabajo} from "./components/trabajo/trabajo.tsx";
export function App() {

  return (
      <>
          <ToastContainer/>
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/miperfil"/>
                  <Route path="/mipedido"/>
                  <Route path="/historialpedido"/>
                  <Route path="/trabajo" element={<Trabajo />}/>
              </Routes>
          </Router>
      </>
  )
}

