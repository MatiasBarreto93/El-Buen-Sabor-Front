import {Layout} from "../Layout/layout.tsx";
import {HeroIMG} from "./heroImg/heroImg.tsx";
import {Categorias} from "./catalogo/categorias.tsx";


export const Home = () =>{
    return(
        <Layout>
            <HeroIMG/>
            <Categorias/>
        </Layout>
    )
}