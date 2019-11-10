import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";


const EmptyLayout = ({ children, noNavbar, noFooter }) => (
  <Container fluid>
    <Row>
      <Col
        className="main-content p-0"
        lg={{ size: 12, offset: 0 }}
        md={{ size: 12, offset: 0 }}
        sm="12"
        tag="main"
      >
        {!noNavbar}
        {children}
        {!noFooter}
      </Col>
    </Row>
  </Container>
);

EmptyLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

EmptyLayout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default EmptyLayout;
