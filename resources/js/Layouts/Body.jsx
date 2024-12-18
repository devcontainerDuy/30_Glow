import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import DynamicTabs from "@/Components/DynamicTabs";

const Body = ({ title, data }) => {
    return (
        <Container className="p-0">
            <Row>
                <Col xs="12">
                    <div className="text-start my-2">
                        <h4 className="fw-semibold text-uppercase" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                            <span>{title}</span>
                        </h4>
                    </div>
                </Col>
                <Col xs="12">
                    <DynamicTabs tabsData={data} />
                </Col>
            </Row>
        </Container>
    );
};

Body.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array,
};

export default Body;
