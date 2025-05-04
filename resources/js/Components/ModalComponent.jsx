import React from "react";
import { Form, Modal } from "react-bootstrap";
import ButtonsComponent from "@/Components/ButtonsComponent";
import PropTypes from "prop-types";

export default function ModalComponent({ show, close, size, submit, title, body, footer, loaded }) {
    size = size || "md";
    title = title || "Modal Title";
    body = body || "Modal Body";

    if (footer === undefined) {
        footer = (
            <>
                <ButtonsComponent type="button" variant="secondary" icon="close" title="Thoát ra" onClick={close} />
                <ButtonsComponent type="submit" variant="success" icon="save" title="Lưu lại" loaded={loaded || false} />
            </>
        );
    }

    return (
        <>
            <Modal show={show} onHide={close} size={size} centered>
                <Form onSubmit={submit} noValidate encType="multipart/form-data">
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

ModalComponent.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    size: PropTypes.string,
    submit: PropTypes.func,
    title: PropTypes.string.isRequired,
    body: PropTypes.node.isRequired,
    footer: PropTypes.node,
    loaded: PropTypes.bool,
};
