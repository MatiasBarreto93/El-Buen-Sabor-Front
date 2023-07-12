import './loader.css'
import {Spinner} from "react-bootstrap";

export const Loader = () => {
    return(
        <div className="loader">
            <Spinner animation="border" variant="danger" className="loader-spinner"/>
        </div>
    )
}