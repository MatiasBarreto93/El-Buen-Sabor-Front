import * as React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import {useEffect, useLayoutEffect} from "react";
import {lazyWithPreload} from "../util/lazyWithPreload.ts";

const Home = lazyWithPreload(() => import("../components/home/home.tsx"));
const MiPedido = lazyWithPreload(() => import("../components/mipedido/MiPedido.tsx"));
const MiPerfil = lazyWithPreload(() => import("../components/miperfil/MiPerfil.tsx"));
const Historialpedido = lazyWithPreload(() => import("../components/historial/historialpedido.tsx"));
const Trabajo = lazyWithPreload(() => import("../components/trabajo/trabajo.tsx"));
const Cajero = lazyWithPreload(() => import("../components/cajero/cajero.tsx"));
const Delivery = lazyWithPreload(() => import("../components/delivery/delivery.tsx"));

const Router: React.FC = () => {

    const location = useLocation();

    useEffect(() => {
        Home.preload();
        MiPerfil.preload();
        MiPedido.preload();
        Historialpedido.preload();
        Trabajo.preload();
        Cajero.preload();
        Delivery.preload();
    }, []);

    // Save scroll position when the user scrolls
    useEffect(() => {
        const saveScrollPosition = () => {
            if (location.pathname === "/") {
                localStorage.setItem(location.pathname, JSON.stringify(window.scrollY.toFixed(1)));
            }
        };

        // Save scroll position when the user scrolls
        window.addEventListener('scroll', saveScrollPosition);

        // Remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('scroll', saveScrollPosition);
        };
    }, [location.pathname]);

    // Restore scroll position with a delay
    useLayoutEffect(() => {
        const restoreScrollPosition = async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (location.pathname === "/") {
                const savedPosition = localStorage.getItem(location.pathname);
                window.scrollTo(0, savedPosition ? JSON.parse(savedPosition) : 0);
            } else {
                window.scrollTo(0, 0);
            }
        }
        restoreScrollPosition();
    }, [location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/miperfil" element={<MiPerfil />} />
            <Route path="/mipedido" element={<MiPedido />} />
            <Route path="/historialpedido" element={<Historialpedido/>} />
            <Route path="/admin" element={<Trabajo />} />
            <Route path="/cajero" element={<Cajero/>} />
            <Route path="/delivery" element={<Delivery/>} />
        </Routes>
    );
}

export default Router;