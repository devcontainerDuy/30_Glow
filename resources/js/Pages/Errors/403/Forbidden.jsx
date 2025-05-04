import React from "react";
import "@css/forbidden.css";
import { Link } from "@inertiajs/react";

const Forbidden = () => {
    return (
        <>
            <div className="body">
                <div className="scene">
                    <div className="overlay" />
                    <div className="overlay" />
                    <div className="overlay" />
                    <div className="overlay" />
                    <span className="bg-403">403</span>
                    <div className="text">
                        <span className="hero-text" />
                        <span className="msg">
                            <span>Bạn không đủ quyền</span> <br />
                            để có thể truy cập vào trang hiện tại.
                        </span>
                        <span className="support">
                            <span>Bạn cần giúp?</span>
                            <Link href="/auth/login">Vui lòng đăng nhập lại</Link>
                        </span>
                    </div>
                    <div className="lock" />
                </div>
            </div>
        </>
    );
};

export default Forbidden;
