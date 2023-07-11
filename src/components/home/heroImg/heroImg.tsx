import Image from 'react-bootstrap/Image'
import {Button} from "react-bootstrap";
export const HeroIMG = () => {
    return (
        <div style={{width: '100%', height: '800px', overflow:'hidden'}}>
            <Image src="/img/LandingPage2.jpg" alt="burger" fluid style={{objectFit: 'cover', height: '800px', width: '100%'}} />
            <div style={{position: 'absolute', top: '50%', left: '10%', transform: 'translateY(-50%)', color: 'white', textAlign: 'left'}}>
                <div className="display-2 fw-bold">La mejor <span style={{color: '#E53935'}}>Comida</span></div>
                <div className="display-2 fw-bold">hasta la puerta</div>
                <div className="display-2 fw-bold">de tu casa</div>
                <Button className="mt-5">¡Haga su Pedido!</Button>
            </div>
        </div>
    );
}