import {Layout} from "../Layout/layout.tsx";
import {HeroIMG} from "./heroImg/heroImg.tsx";
import {Catalogo} from "./catalogo/catalogo.tsx";
import './../styles/background.css'

const Home = () =>{
    return(
        <div className="background-img">
            <Layout>
                <HeroIMG/>
                <Catalogo/>
            </Layout>
        </div>
    )
}

export default Home;