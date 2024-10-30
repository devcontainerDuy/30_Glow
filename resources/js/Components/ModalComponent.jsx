import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function ModalComponent({ show, close, title, body }) {
    return (
        <>
            <Modal show={show} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close}>
                        <i className="bi bi-box-arrow-right" />
                        <span className="ms-2">Thoát ra</span>
                    </Button>
                    <Button variant="primary" type="submit" onClick={close}>
                        <i className="bi bi-floppy-fill" />
                        <span className="ms-2">Lưu lại</span>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
