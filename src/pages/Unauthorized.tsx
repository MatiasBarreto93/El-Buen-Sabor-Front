import {SignStop} from "react-bootstrap-icons";

const Unauthorized = () => {
    return(
        <div className="perfil-img">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="rectangle text-center " style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '509px', width: "80%", marginTop: "80px"}}>
                    <div><SignStop size={96} color="grey"/></div>
                    <h2 className="mt-5" style={{color: 'grey'}}>¡Acceso no autorizado!</h2>
                    <h4 className="mt-2" style={{color: 'grey'}}>401</h4>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized;