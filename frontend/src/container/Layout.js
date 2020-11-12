import React from "react";
import {
  Container,
  Col,
  Row
} from "react-bootstrap";
import NavBar from "components/NavBar";

const Layout = ({ children }) => {
  return (
    <div className="py-4">
      <Container>
        <Row className="row">
          <Col xs={12}>
            <NavBar />
            { children }
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Layout;