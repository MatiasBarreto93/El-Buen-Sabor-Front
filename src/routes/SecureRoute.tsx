import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from "../interfaces/UserRole.ts";
import React from 'react';
import { useUserPermission } from "../context/permission/UserPermission.tsx";
import {useAuth0} from "@auth0/auth0-react";

interface SecureRouteProps {
    roles: UserRole[];
    children: React.ReactNode;
    requiresAuth?: boolean;
}

export const SecureRoute: React.FC<SecureRouteProps> = ({ children, roles, requiresAuth = false }) => {
    const { permission } = useUserPermission();
    const location = useLocation();
    const { isAuthenticated } = useAuth0();

    if ((requiresAuth && !isAuthenticated) || !roles.includes(permission)) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
