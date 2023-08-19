import * as React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import {useEffect, useLayoutEffect} from "react";
import {lazyWithPreload} from "../util/lazyWithPreload.ts";

const Home = lazyWithPreload(() => import("../components/home/home.tsx"));
const MiPedido = lazyWithPreload(() => import("../components/mipedido/MiPedido.tsx"));
const MiPerfil = lazyWithPreload(() => import("../components/miperfil/MiPerfil.tsx"));
const Historialpedido = lazyWithPreload(() => import("../components/historial/historialpedido.tsx"));
const Trabajo = lazyWithPreload(() => import("../components/trabajo/trabajo.tsx"));
const Cashier = lazyWithPreload(() => import("../components/cashier/cashier.tsx"));
const Delivery = lazyWithPreload(() => import("../components/delivery/delivery.tsx"));
const OrderDetail = lazyWithPreload(() => import("../components/mipedido/orderDetail/newOrderDetail.tsx"));
const CustomerOrderDetail = lazyWithPreload(() => import("../components/historial/customerOrderDetail.tsx"));
const Kitchen = lazyWithPreload(() => import("../components/kitchen/kitchen.tsx"));
const KitchenOrderDetail = lazyWithPreload(() => import("../components/kitchen/kitchenOrderDetail.tsx"));

const Router: React.FC = () => {

    const location = useLocation();

    useEffect(() => {
        Home.preload();
        MiPerfil.preload();
        MiPedido.preload();
        Trabajo.preload();
        Cashier.preload();
        Delivery.preload();
        Kitchen.preload();
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
            <Route path="/cajero" element={<Cashier/>} />
            <Route path="/delivery" element={<Delivery/>} />
            <Route path="/cocina" element={<Kitchen/>} />
            <Route path="/detalleorden" element={<OrderDetail/>} />
            <Route path="/detalle-orden/:id" element={<CustomerOrderDetail/>} />
            <Route path="/detalle-orden-cocina/:id" element={<KitchenOrderDetail/>} />
        </Routes>
    );
}

export default Router;