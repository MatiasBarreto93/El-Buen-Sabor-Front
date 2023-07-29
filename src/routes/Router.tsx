import * as React from 'react';
import {Route, Routes} from 'react-router-dom';
import {useEffect} from "react";
import {lazyWithPreload} from "../util/lazyWithPreload.ts";

const Home = lazyWithPreload(() => import("../components/home/home.tsx"));
const MiPedido = lazyWithPreload(() => import("../components/mipedido/MiPedido.tsx"));
const MiPerfil = lazyWithPreload(() => import("../components/miperfil/MiPerfil.tsx"));
const Trabajo = lazyWithPreload(() => import("../components/trabajo/trabajo.tsx"));
//const ProductDetail = lazy(() => import ("../components/home/catalogo/productDetail.tsx"))

const Router: React.FC = () => {

    useEffect(() => {
        Home.preload();
        MiPerfil.preload();
        MiPedido.preload();
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/miperfil" element={<MiPerfil />} />
            <Route path="/mipedido" element={<MiPedido />} />
            <Route path="/trabajo" element={<Trabajo />} />
        </Routes>
    );

}

export default Router;