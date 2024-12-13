import React from "react";
import { Button, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";

const ButtonsComponent = ({ type, variant, icon, title, onClick, loaded }) => {
    const tpyeIcon = (i) => {
        switch (i) {
            case "add":
                return <i className="bi bi-plus-circle" />;
            case "view":
                return <i className="bi bi-eye" />;
            case "edit":
                return <i className="bi bi-pencil" />;
            case "delete":
                return <i className="bi bi-trash" />;
            case "close":
                return <i className="bi bi-x-circle" />;
            default:
                return <i className="bi bi-exclamation-circle" />;
        }
    };

    return (
        <>
            <Button type={type} variant={variant} onClick={onClick}>
                {loaded ? (
                    <Spinner animation="border" size="sm" />
                ) : (
                    <>
                        {tpyeIcon(icon)}
                        <span className="ms-2">{title}</span>
                    </>
                )}
            </Button>
        </>
    );
};

export default ButtonsComponent;

ButtonsComponent.defaultProps = {
    type: "button",
    variant: "primary",
    icon: "add",
    title: "Button",
    onClick: () => {},
    loaded: false,
};

ButtonsComponent.propTypes = {
    type: PropTypes.string,
    variant: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    loaded: PropTypes.bool,
};
