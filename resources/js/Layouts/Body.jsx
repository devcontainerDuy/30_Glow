import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import DynamicTabs from "@/Components/DynamicTabs";
import Title from "@/Containers/Title";

const Body = ({ title, data }) => {
    return (
        <Container className="p-0">
            <Row>
                <Col xs="12">
                    <Title props={title} />
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
