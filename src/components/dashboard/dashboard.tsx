import {Nav, Tab, Col, Row, Container} from "react-bootstrap";
import "./dashboard.css"
import {PersonCircle} from "react-bootstrap-icons";

export const DashBoard = () => {

    return (
        <Container fluid className="containerDB mt-5 mb-5 mx-2">
        <Tab.Container defaultActiveKey="Principal">
            <Row className="w-100">
                <Col sm={3} style={{ maxWidth: "fit-content"}}>
                    <div className="p-2 text-center userinfoDB">
                        <div>
                            <PersonCircle size={52} color={"#D32F2F"} className="mb-3"/>
                        </div>
                        <div className="mb-3">
                            <div>Nombre Apellido</div>
                        </div>
                        <div className="text-danger fw-bold mb-3">Admin</div>
                    </div>
                    <Nav variant="pills" className="flex-column" style={{ maxWidth: "fit-content", position: "sticky", top: "80px"}}>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Principal" className="navLinkDB">Principal</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Empleados" className="navLinkDB">Empleados</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Clientes" className="navLinkDB">Clientes</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Rubros" className="navLinkDB">Rubros</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Ingredientes" className="navLinkDB">Ingredientes</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Productos" className="navLinkDB">Productos</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Stock" className="navLinkDB">Stock</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="navItemDB">
                            <Nav.Link eventKey="Movimientos" className="navLinkDB">Movimientos Monetarios</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col>
                    <div className="row">
                        <Tab.Content style={{ maxWidth: "fit-content" }}>
                            <Tab.Pane eventKey="Principal">
                                <div className="col">Principal</div>
                                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto asperiores
                                    aspernatur cupiditate, dolores ex illo labore molestias odio officiis perspiciatis
                                    quod repellat, reprehenderit rerum similique tempora velit veritatis vitae,
                                    voluptatibus?
                                </div>
                                <div>Alias amet aperiam architecto consequatur dicta, distinctio dolor dolores eligendi
                                    eum excepturi expedita hic illum laudantium maxime molestiae nesciunt non numquam
                                    odit omnis, quasi quibusdam, rem similique sit sunt unde?
                                </div>
                                <div>Dolor, maxime, repudiandae? Atque blanditiis dolorem explicabo fugiat impedit
                                    laboriosam maiores natus odit ratione veniam. Asperiores commodi earum est hic
                                    illum, molestiae molestias non perferendis quia temporibus tenetur ullam veritatis.
                                </div>
                                <div>Magni neque officiis quam voluptate voluptatem. Dignissimos distinctio dolores
                                    excepturi facilis laboriosam magni ratione rerum? Accusantium alias cupiditate eos
                                    minima molestias, possimus praesentium quaerat quas qui sint soluta tempora totam.
                                </div>
                                <div>Accusamus at commodi cum delectus distinctio dolorem eligendi error harum id,
                                    impedit inventore ipsum iste laudantium nemo pariatur qui saepe sint unde, vero
                                    voluptatem! Architecto dolorem dolores quo saepe similique.
                                </div>
                                <div>Amet architecto deleniti dicta dolor dolorem est eum excepturi expedita harum illum
                                    impedit ipsam mollitia praesentium quisquam quos ratione, sapiente sequi suscipit
                                    tenetur veniam! Assumenda incidunt magnam maiores perspiciatis reiciendis!
                                </div>
                                <div>A accusantium alias blanditiis consequuntur culpa distinctio, dolor, ducimus enim
                                    et illo in ipsa iste iusto laboriosam natus nulla odit quidem quo quod repellat,
                                    repellendus sit unde ut velit vero.
                                </div>
                                <div>Beatae dolor facere in, maxime mollitia nam numquam tempore voluptatibus. Ab amet
                                    asperiores aspernatur at eveniet, expedita fugiat harum in iusto minus natus quas,
                                    qui ratione sequi similique veniam voluptates?
                                </div>
                                <div>Adipisci aperiam assumenda beatae commodi delectus deserunt dicta ducimus eos eum
                                    eveniet explicabo harum, impedit laborum magni modi necessitatibus nemo nobis
                                    numquam porro possimus quia rerum sapiente tenetur voluptatem voluptatum.
                                </div>
                                <div>Ab blanditiis consequuntur eos facilis impedit maiores porro quo rerum temporibus
                                    unde. Consequatur enim facilis incidunt optio porro quod recusandae sequi, tenetur
                                    vero vitae! Dolorum eum ipsam repudiandae totam voluptatum.
                                </div>
                                <div>Aut commodi corporis, delectus deserunt dolor dolorem dolores dolorum ea eveniet
                                    incidunt ipsa maiores modi necessitatibus nesciunt nulla omnis provident quaerat
                                    quia quidem, quis quod sed, sunt. Fugit, iure suscipit.
                                </div>
                                <div>Ad, animi asperiores at ducimus esse illo labore nostrum nulla porro repudiandae
                                    sequi sunt ullam velit. Cum cupiditate fuga fugit sed sequi veritatis. Corporis ex
                                    itaque modi odit officia veniam.
                                </div>
                                <div>Accusantium asperiores assumenda atque, cum deleniti, ex labore, nobis optio
                                    praesentium quo repellat reprehenderit sit unde voluptates voluptatum! Ab aliquam
                                    debitis exercitationem explicabo labore qui quod rerum tempora, tenetur voluptatum.
                                </div>
                                <div>Accusamus aliquid beatae corporis culpa doloremque doloribus eius eligendi et
                                    excepturi explicabo facere harum modi mollitia nobis non nulla obcaecati, odio
                                    provident quasi sed sequi sint tenetur ut voluptatem voluptates!
                                </div>
                                <div>Accusamus adipisci animi, aperiam debitis dolore eveniet fugiat ipsam, iure
                                    laboriosam nemo placeat quaerat quos rem rerum voluptatum? Adipisci eaque eius
                                    expedita nemo, praesentium quia reprehenderit temporibus velit voluptatum. Maiores.
                                </div>
                                <div>Amet blanditiis earum est exercitationem explicabo fugiat fugit laborum minima
                                    mollitia sed. A ab assumenda cupiditate ipsam libero molestiae neque officiis
                                    ratione suscipit vitae. Aliquid beatae nisi omnis recusandae voluptas!
                                </div>
                                <div>At atque aut dolor dolore dolorem dolorum enim et harum ipsa iusto labore, magnam
                                    mollitia nam nihil numquam odit officiis omnis porro quam ratione recusandae saepe
                                    ut vel vero voluptatum.
                                </div>
                                <div>Architecto consequuntur deserunt distinctio dolore eum fugit id illo illum incidunt
                                    inventore iste iure labore natus necessitatibus odio praesentium provident quam rem
                                    repudiandae sapiente similique tempore velit veniam, voluptate voluptatum?
                                </div>
                                <div>Excepturi impedit ipsa itaque iusto laudantium mollitia possimus saepe
                                    voluptatibus. Accusantium, architecto at aut cum, debitis et fugiat harum magni
                                    nobis nostrum optio provident ratione reprehenderit rerum velit vero, voluptates!
                                </div>
                                <div>Aut blanditiis consectetur deleniti doloribus excepturi fugit harum illum, iure
                                    laboriosam minus molestias non obcaecati possimus praesentium, quasi qui quia
                                    sapiente tempora tempore tenetur. Accusamus hic necessitatibus optio sed sint.
                                </div>
                                <div>Autem deleniti expedita mollitia nam obcaecati possimus quae, quia reiciendis?
                                    Aliquam, asperiores atque aut autem delectus distinctio doloremque error ipsum
                                    magnam molestias nulla praesentium provident recusandae reiciendis sed soluta,
                                    voluptatum!
                                </div>
                                <div>Deserunt modi quo quod? Accusantium, aliquid culpa cum cupiditate dicta ea id ipsum
                                    iure laboriosam magni maxime molestias mollitia neque, nulla pariatur reprehenderit
                                    sed sit soluta tempora voluptates. Assumenda, consequatur!
                                </div>
                                <div>Assumenda doloremque harum libero minima quasi quia quis repellendus sit! At,
                                    cumque eius ex impedit incidunt, mollitia odit omnis perspiciatis, quis quod
                                    repudiandae rerum ullam velit? Non officiis pariatur ratione.
                                </div>
                                <div>Architecto harum id ipsum maiores similique soluta voluptatem! Assumenda dolore
                                    excepturi harum repellat repellendus. Autem est eveniet ipsum omnis unde vero
                                    voluptate. Accusamus aperiam beatae consequuntur ea ipsam nisi pariatur.
                                </div>
                                <div>Accusantium adipisci alias architecto beatae cupiditate delectus, dolore earum eius
                                    esse eveniet, ex excepturi ipsa iusto minima nostrum numquam odio odit officia
                                    pariatur quae quas rerum sint totam veritatis, vero.
                                </div>
                                <div>Animi dolorum impedit officiis quae, quam voluptate! Aut ipsa sapiente vel
                                    voluptate? Amet at maxime minus nihil, officia repudiandae tempore voluptate. Aut
                                    dicta dolore dolorem, eaque inventore maiores molestiae totam.
                                </div>
                                <div>Consequatur dolor est harum hic illum in inventore ipsa labore laboriosam libero,
                                    maiores minima molestias nam natus necessitatibus nobis nulla numquam quaerat quasi
                                    quos reiciendis rerum, sequi sint voluptas voluptatibus?
                                </div>
                                <div>Accusamus aliquam corporis fugit magni omnis pariatur unde veniam veritatis
                                    voluptatibus. Aut corporis illo illum laudantium magnam modi nemo nobis odio placeat
                                    quae quia recusandae repellendus sapiente, totam ut! Fugit!
                                </div>
                                <div>Accusantium animi blanditiis dolore doloribus iure officia placeat provident quam
                                    repellendus suscipit? Accusantium cumque error facilis, hic ipsa labore nemo nisi
                                    non optio porro quis temporibus tenetur vel veniam voluptatibus.
                                </div>
                                <div>A aliquam consectetur, corporis debitis distinctio dolores doloribus enim eum
                                    excepturi, explicabo harum id illum iusto, modi non nostrum officiis quo recusandae
                                    saepe vel. Ad adipisci aperiam atque cupiditate unde?
                                </div>
                                <div>Aut consequatur distinctio dolore dolorum eius eos, est fugiat hic labore minus
                                    molestiae molestias nam natus non odio omnis placeat quam quia quo ratione repellat
                                    sint tempora totam ut velit.
                                </div>
                                <div>A aspernatur atque delectus eius, expedita nostrum porro soluta. A accusamus amet
                                    aperiam consequatur eos harum, magnam nihil porro quo recusandae unde vero?
                                    Consectetur illo natus necessitatibus officiis, veritatis voluptates?
                                </div>
                                <div>Ad adipisci amet animi beatae commodi cupiditate deleniti, dicta et eveniet
                                    explicabo fugit, impedit iste labore magni necessitatibus odit, omnis quo
                                    repudiandae sint totam veniam vero voluptatibus? Animi, non, omnis.
                                </div>
                                <div>Adipisci atque consectetur delectus distinctio dolorum est eum eveniet ex fuga
                                    ipsam iste libero nemo neque nesciunt non nostrum, possimus quasi quisquam
                                    recusandae reprehenderit repudiandae rerum sit velit voluptate voluptatem?
                                </div>
                                <div>Accusantium corporis dolor dolorem dolores exercitationem explicabo labore minus
                                    mollitia nihil numquam sed, tenetur ullam, voluptatibus. Delectus eaque inventore
                                    iste laudantium, maxime nesciunt perferendis, quisquam quos reiciendis, sapiente
                                    sunt tenetur.
                                </div>
                                <div>Aliquid cumque cupiditate debitis dicta distinctio dolore ducimus eligendi esse et
                                    fugiat harum inventore itaque iure magni maxime minus natus nemo neque perferendis
                                    possimus quae qui reprehenderit repudiandae, tempora ut?
                                </div>
                                <div>A ad amet asperiores autem consequatur cum deserunt dolorum earum eligendi, enim
                                    esse est harum in maiores modi, mollitia nisi numquam, omnis praesentium recusandae
                                    sunt tempora ullam velit veritatis vero.
                                </div>
                                <div>Dignissimos dolorem dolorum est ex ipsa molestias nostrum omnis sunt, ut.
                                    Asperiores corporis cum dicta dolore expedita inventore laborum, omnis, pariatur
                                    possimus qui suscipit, velit! Aliquam aperiam neque porro recusandae.
                                </div>
                                <div>Amet animi aperiam at dolorum et explicabo illum in maiores minus necessitatibus,
                                    non odio omnis pariatur perferendis, porro quaerat qui repellat sit suscipit vero!
                                    Amet consectetur expedita neque nobis tempore.
                                </div>
                                <div>Accusantium adipisci architecto beatae consequatur cum cumque dolorem eaque esse
                                    exercitationem harum id, illum iure iusto laudantium maxime nemo nobis non pariatur
                                    quas quis sed similique soluta totam ut, voluptatibus!
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Empleados">
                                <p>Empleados</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Clientes">
                                <p>Clientes</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Rubros">
                                <p>Rubros</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Ingredientes">
                                <p>Ingredientes</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Productos">
                                <p>Productos</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Stock">
                                <p>Stock</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Movimientos">
                                <p>Movimientos</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </Col>
            </Row>
        </Tab.Container>
        </Container>
    );
};
