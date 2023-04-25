import {Col, Container, Row} from "react-bootstrap";
import {Telephone, Envelope, GeoAlt, Facebook} from "react-bootstrap-icons";
export const Footer = () => {
    return (
        <footer className="bg-dark">
            <Container fluid className="d-flex justify-content-center">
                <Row>
                    {/* Columna izquierda */}
                    <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
                        <img src="/img/footerIMG.png" alt="Logo de la empresa" height="200px"/>
                    </Col>
                    {/* Columna derecha */}
                    <Col xs={12} md={8} className="justify-content-between align-items-center p-5">
                        <div className="ms-2">
                            <p className="text-light">
                                <Telephone size={24} className="me-2"/>
                                +123456789
                            </p>
                            <p className="text-light">
                                <Envelope size={24} className="me-2"/>
                                info@empresa.com
                            </p>
                            <p className="text-light">
                                <GeoAlt size={24} className="me-2"/>
                                Av. Siempre Viva 1234
                            </p>
                            <p className="text-light">
                                <Facebook size={24} className="me-2"/>
                                El-Buen-Sabor
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}