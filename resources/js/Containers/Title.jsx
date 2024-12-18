import React from "react";
import PropTypes from "prop-types";

export default function Title({ props }) {
    return (
        <>
            <div className="text-start my-2">
                <h4 className="fw-semibold text-uppercase" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                    <span>{props}</span>
                </h4>
            </div>
        </>
    );
}

Title.propTypes = {
    props: PropTypes.string.isRequired,
};
