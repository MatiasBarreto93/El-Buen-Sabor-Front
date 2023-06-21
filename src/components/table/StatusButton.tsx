import {LockFill, UnlockFill} from "react-bootstrap-icons";

interface Props{
    isBlocked: boolean;
    onClick: () => void;
}

export const StatusButton = ({onClick, isBlocked}:Props) => {

    return (
        <>
            {isBlocked ? (
                <LockFill
                    color="#D32F2F"
                    size={24}
                    onClick={onClick}
                    onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
                    onMouseLeave={() => { document.body.style.cursor = 'default' }}
                />
            ) : (
                <UnlockFill
                    color="#34A853"
                    size={24}
                    onClick={onClick}
                    onMouseEnter={() => { document.body.style.cursor = 'pointer' }}
                    onMouseLeave={() => { document.body.style.cursor = 'default' }}
                />
            )}
        </>
    );
}