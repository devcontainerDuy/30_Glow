import React from "react";
import { Button } from "react-bootstrap";

export default function ButtonComponent({ type, variant, title, onClick }) {
    return (
        <>
            <Button type={type} variant={variant} onClick={onClick}>
                {title}
            </Button>
        </>
    );
}
