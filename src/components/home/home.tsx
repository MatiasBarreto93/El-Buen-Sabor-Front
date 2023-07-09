import {Layout} from "../Layout/layout.tsx";
import {HeroIMG} from "./heroImg/heroImg.tsx";
import {Catalogo} from "./catalogo/catalogo.tsx";


export const Home = () =>{
    return(
        <Layout>
            <HeroIMG/>
            <Catalogo/>
        </Layout>
    )
}