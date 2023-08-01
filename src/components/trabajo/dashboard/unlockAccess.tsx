import React from 'react';
import { UserRole} from "../../../interfaces/UserRole.ts";
import { useUserPermission} from "../../../context/permission/UserPermission.tsx";

type UnlockAccessProps = {
    children: React.ReactNode;
    request: UserRole[];
};

export const UnlockAccess: React.FC<UnlockAccessProps> = ({ children, request }) => {
    const { permission } = useUserPermission();

    const isAccessGranted = request.includes(permission);

    return (
        <>
            {isAccessGranted && children}
        </>
    );
};
