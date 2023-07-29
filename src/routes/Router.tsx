import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as React from 'react';
import {useEffect} from "react";
import {lazyWithPreload} from "../util/lazyWithPreload.ts";

const Home = lazyWithPreload(() => import("../components/home/home.tsx"));
const MiPedido = lazyWithPreload(() => import("../components/mipedido/MiPedido.tsx"));
const MiPerfil = lazyWithPreload(() => import("../components/miperfil/MiPerfil.tsx"));
const Trabajo = lazyWithPreload(() => import("../components/trabajo/trabajo.tsx"));

const Router: React.FC = () => {

    useEffect(() => {
        Home.preload();
        MiPerfil.preload();
        MiPedido.preload();
    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/miperfil",
            element: <MiPerfil />,
        },
        {
            path: "/mipedido",
            element: <MiPedido />,
        },
        {
            path: "/trabajo",
            element: <Trabajo />,
        },
    ]);
    return <RouterProvider router={router}/>
}

export default Router;