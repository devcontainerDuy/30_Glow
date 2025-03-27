import { Link, usePage } from "@inertiajs/react";
import { Container, Breadcrumb } from "react-bootstrap";
import PropTypes from "prop-types";

function BreadcrumbComponent({ props, children }) {
    const { url } = usePage();
    return (
        <Container className="p-0 my-1 ">
            <div className="d-flex flex-wrap justify-content-md-between align-items-center bg-body-tertiary rounded-3 p-2">
                <Breadcrumb aria-label="breadcrumb" className="mt-3 ms-3">
                    <Breadcrumb.Item href="/admin/" linkAs={Link} linkProps={{ to: "/admin/" }}>
                        <i className="bi bi-house-door-fill" width="16" height="16" />
                        <span className="visually-hidden">Home</span>
                    </Breadcrumb.Item>
                    {props &&
                        props.map((item, index) => (
                            <Breadcrumb.Item
                                key={index}
                                href={item.url}
                                linkAs={Link}
                                linkProps={{ to: item.url }}
                                aria-current={index === 0 ? "page" : false}
                                className="text-capitalize"
                                active={item.url === url ? true : false}
                            >
                                {item.name}
                            </Breadcrumb.Item>
                        ))}
                </Breadcrumb>
                <div className="me-3">{children}</div>
            </div>
        </Container>
    );
}

export default BreadcrumbComponent;

BreadcrumbComponent.propTypes = {
    props: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.node,
};
