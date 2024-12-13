import React from "react";
import { Form, Modal } from "react-bootstrap";
import ButtonsComponent from "@/Components/ButtonsComponent";
import PropTypes from "prop-types";

export default function ModalComponent({ show, close, size, submit, title, body, footer, loaded }) {
    if (footer === undefined) {
        footer = (
            <>
                <ButtonsComponent type="button" variant="secondary" icon="close" title="Thoát ra" onClick={close} />
                <ButtonsComponent type="submit" variant="success" icon="save" title="Lưu lại" loaded={loaded} />
            </>
        );
    }

    return (
        <>
            <Modal show={show} onHide={close} size={size} centered>
                <Form onSubmit={submit}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <span>{title}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        className="overflow-auto"
                        style={{
                            maxHeight: "calc(100vh - 210px)",
                        }}
                    >
                        {body}
                    </Modal.Body>
                    <Modal.Footer>{footer}</Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

ModalComponent.defaultProps = {
    size: "md",
    title: "Modal Title",
    body: "Modal Body",
};

ModalComponent.propTypes = {
    show: PropTypes.bool,
    close: PropTypes.func,
    size: PropTypes.string,
    submit: PropTypes.func,
    title: PropTypes.string,
    body: PropTypes.node,
    footer: PropTypes.node,
    loaded: PropTypes.bool,
};
