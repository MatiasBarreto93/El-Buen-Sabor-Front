import {Layout} from "./components/Layout/layout.tsx";
import {HeroIMG} from "./components/landinpage/hero/hero.tsx";
import {Categorias} from "./components/landinpage/catalogo/categorias.tsx";
import {DashBoard} from "./components/dashboard/dashboard.tsx";

export function App() {

  return (
    <Layout>
        <HeroIMG/>
        <Categorias/>
        <DashBoard/>
    </Layout>
  )
}

