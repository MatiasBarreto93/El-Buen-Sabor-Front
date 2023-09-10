import * as React from 'react';
import {useEffect, useLayoutEffect} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import {lazyWithPreload} from "../util/lazyWithPreload.ts";
import {SecureRoute} from "./SecureRoute.tsx";
import {UserRole} from "../interfaces/UserRole.ts";
import {AdminOrdersHistoryTable} from "../components/trabajo/menus/customersummary/AdminOrdersHistoryTable.tsx";

const Home = lazyWithPreload(() => import("../components/home/home.tsx"));
const MiPedido = lazyWithPreload(() => import("../components/mipedido/MiPedido.tsx"));
const MiPerfil = lazyWithPreload(() => import("../components/miperfil/MiPerfil.tsx"));
const Historialpedido = lazyWithPreload(() => import("../components/historial/historialpedido.tsx"));
const Trabajo = lazyWithPreload(() => import("../components/trabajo/trabajo.tsx"));
const Cashier = lazyWithPreload(() => import("../components/cashier/cashier.tsx"));
const Delivery = lazyWithPreload(() => import("../components/delivery/delivery.tsx"));
const Kitchen = lazyWithPreload(() => import("../components/kitchen/kitchen.tsx"));
const KitchenOrderDetail = lazyWithPreload(() => import("../components/kitchen/kitchenOrderDetail.tsx"));
const OrderDetail = lazyWithPreload(() => import("../components/mipedido/orderDetail/newOrderDetail.tsx"));
const CustomerOrderDetail = lazyWithPreload(() => import("../components/historial/customerOrderDetail.tsx"));
const NotFound = lazyWithPreload(() => import("../pages/NotFound.tsx"));
const Unauthorized = lazyWithPreload(() => import("../pages/Unauthorized.tsx"));


const Router: React.FC = () => {

    const location = useLocation();

    useEffect(() => {
        Home.preload();
        MiPedido.preload();
        MiPerfil.preload();
        Historialpedido.preload();
        Trabajo.preload();
        Cashier.preload();
        Delivery.preload();
        Kitchen.preload();
        KitchenOrderDetail.preload();
        OrderDetail.preload();
        CustomerOrderDetail.preload();
        NotFound.preload();
        Unauthorized.preload();
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
            <Route path="/miperfil" element={<SecureRoute requiresAuth={true} roles={[UserRole.Admin, UserRole.Cocinero, UserRole.Cajero, UserRole.Repartidor, UserRole.Cliente]}><MiPerfil /></SecureRoute>} />
            <Route path="/mipedido" element={<SecureRoute requiresAuth={false} roles={[UserRole.Admin, UserRole.Cocinero, UserRole.Cajero, UserRole.Repartidor, UserRole.Cliente]}><MiPedido /></SecureRoute>} />
            <Route path="/historialpedido" element={<SecureRoute requiresAuth={true} roles={[UserRole.Admin, UserRole.Cocinero, UserRole.Cajero, UserRole.Repartidor, UserRole.Cliente]}><Historialpedido /></SecureRoute>} />
            <Route path="/detalleorden" element={<SecureRoute requiresAuth={true} roles={[UserRole.Admin, UserRole.Cocinero, UserRole.Cajero, UserRole.Repartidor, UserRole.Cliente]}><OrderDetail /></SecureRoute>} />
            <Route path="/detalle-orden/:id" element={<SecureRoute requiresAuth={true} roles={[UserRole.Admin, UserRole.Cocinero, UserRole.Cajero, UserRole.Repartidor, UserRole.Cliente]}><CustomerOrderDetail /></SecureRoute>} />
            <Route path="/customer-orders-history/:id" element={<SecureRoute requiresAuth={true} roles={[UserRole.Admin]}><AdminOrdersHistoryTable/></SecureRoute>} />
            <Route path="/admin" element={<SecureRoute requiresAuth={true} roles={[UserRole.Admin, UserRole.Cocinero]}><Trabajo /></SecureRoute>} />
            <Route path="/cajero" element={<SecureRoute requiresAuth={true} roles={[UserRole.Admin, UserRole.Cajero]}><Cashier /></SecureRoute>} />
            <Route path="/delivery" element={<SecureRoute requiresAuth={true} roles={[UserRole.Admin, UserRole.Repartidor]}><Delivery /></SecureRoute>} />
            <Route path="/cocina" element={<SecureRoute requiresAuth={true} roles={[UserRole.Admin, UserRole.Cocinero]}><Kitchen /></SecureRoute>} />
            <Route path="/detalle-orden-cocina/:id" element={<SecureRoute requiresAuth={true} roles={[UserRole.Admin, UserRole.Cocinero]}><KitchenOrderDetail /></SecureRoute>} />
            <Route path="*" element={<NotFound />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
    );
}

export default Router;