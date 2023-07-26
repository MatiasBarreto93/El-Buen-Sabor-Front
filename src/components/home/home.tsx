import {HeroIMG} from "./heroImg/heroImg.tsx";
import {Catalogo} from "./catalogo/catalogo.tsx";
import './../styles/background.css'

const Home = () =>{
    return(
        <div className="background-img">
            <HeroIMG/>
            <Catalogo/>
        </div>
    )
}

export default Home;