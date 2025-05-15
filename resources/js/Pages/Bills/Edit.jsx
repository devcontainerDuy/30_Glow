import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Layout from "@/Layouts/Index";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";

function Edit({ bill, crumbs }) {
    const [data, setData] = useState([]);
    const [product, setProduct] = useState([]);
    const [status, setStatus] = useState("");

    const handleBack = () => {
        setData([]);
        setProduct([]);
        setStatus("");
        router.visit("/admin/bills", {
            method: "get",
        });
    };

    const paymentMethod = (method) => {
        switch (Number(method)) {
            case 0:
                return "Thanh toán khi nhân hàng";
            case 1:
                return "Thanh toán qua thẻ ngân hàng";
            case 2:
                return "Thanh toán qua ví điện tử";
            default:
                return "Thanh toán lỗi";
        }
    };

    const paymentStatus = (status) => {
        switch (Number(status)) {
            case 0:
                return "Chưa thanh toán";
            case 1:
                return "Đã thanh toán";
            case 2:
                return "Đã hoàn trả";
            default:
                return "Thanh toán lỗi";
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = Number(e.target.value);
        setStatus(newStatus);
        setData({ ...data, status: newStatus });
    };

    const handleStatus = (e) => {
        e.preventDefault();
        axios
            .put("/admin/bills/" + data.uid, {
                status,
            })
            .then((res) => {
                if (res.data.check == true) {
                    toast.success(res.data.message);
                    // setTimeout(() => {
                    //     router.visit("/admin/bills/" + data.uid + "/edit", {
                    //         method: "get",
                    //     });
                    // }, 2000);
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    useEffect(() => {
        setData(bill);
        setProduct(bill.bill_detail);
    }, [bill]);

    return (
        <>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button className="ms-2" variant="secondary" onClick={handleBack}>
                                <i className="bi bi-box-arrow-right" />
                                <span className="ms-2">Quay lại</span>
                            </Button>
                            <Button className="ms-2" variant="success" type="submit" onClick={handleStatus}>
                                <i className="bi bi-floppy-fill" />
                                <span className="ms-2">Lưu lại</span>
                            </Button>
                        </BreadcrumbComponent>

                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Chi tiết dịch vụ đặt</h4>
                                </div>
                                <Form encType="multipart/form-data">
                                    <Row className="row-gap-3">
                                        {/* Thông tin Booking */}
                                        <Col xs={12} md={8}>
                                            <Row className="row-gap-3">
                                                <Col xs={12}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title className="text-primary">Thông tin chi tiết hóa đơn</Card.Title>
                                                            <Form.Group className="mb-3" controlId="code">
                                                                <Form.Label>Mã hóa đơn</Form.Label>
                                                                <Form.Control type="text" value={data.uid || "Không có mã hóa đơn"} readOnly disabled />
                                                            </Form.Group>
                                                            <Row className="row-gap-3">
                                                                <Col>
                                                                    <Form.Group className="mb-3" controlId="payment">
                                                                        <Form.Label>Phương thức thanh toán</Form.Label>
                                                                        <Form.Control type="text" value={paymentMethod(data.payment_method)} readOnly disabled />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Group className="mb-3" controlId="paymentStatus">
                                                                        <Form.Label>Trạng thái thanh toán</Form.Label>
                                                                        <Form.Control type="text" value={paymentStatus(data.payment_status)} readOnly disabled />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            <Form.Group className="mb-3" controlId="note">
                                                                <Form.Label>Ghi chú</Form.Label>
                                                                <Form.Control as="textarea" rows={3} value={data.note || "Không có nhập ghi chú"} placeholder="Ghi chú..." disabled />
                                                            </Form.Group>
                                                            <Row className="row-gap-3">
                                                                <Col>
                                                                    <Form.Group className="mb-3" controlId="status">
                                                                        <Form.Label>Trạng thái đơn hàng</Form.Label>
                                                                        <Form.Select value={data.status} onChange={handleStatusChange}>
                                                                            <option value={0}>Đang chờ xử lý</option>
                                                                            <option value={1}>Đã xác nhận</option>
                                                                            <option value={2}>Đã giao đơn vị vận chuyển</option>
                                                                            <option value={3}>Đang giao hàng</option>
                                                                            <option value={4}>Đã giao hàng</option>
                                                                            <option value={5}>Khách hàng từ chối nhận</option>
                                                                            <option value={6}>Đã hoàn trả</option>
                                                                        </Form.Select>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Group className="mb-3" controlId="transactionId">
                                                                        <Form.Label>Mã giao dịch</Form.Label>
                                                                        <Form.Control type="text" value={data.transaction_id || "Không có mã giao dịch"} readOnly disabled />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            <Row className="mb-3">
                                                                <Col md={6}>
                                                                    <Form.Group controlId="createdAt">
                                                                        <Form.Label>Ngày tạo hóa đơn</Form.Label>
                                                                        <Form.Control type="text" value={new Date(data.created_at).toLocaleString()} readOnly disabled />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col md={6}>
                                                                    <Form.Group controlId="createdTime">
                                                                        <Form.Label>Ngày cập nhật mới nhất</Form.Label>
                                                                        <Form.Control type="text" value={new Date(data.updated_at).toLocaleString()} readOnly disabled />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={12}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title className="text-primary">Danh sách sản phẩm</Card.Title>
                                                            {product && product.length > 0 ? (
                                                                <Table striped bordered hover responsive>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Tên sản phẩm</th>
                                                                            <th>Số lượng</th>
                                                                            <th>Giá lúc mua</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {product.map((item, index) => (
                                                                            <tr key={index}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{item.product?.name || "Không có tên sản phẩm"}</td>
                                                                                <td>{item.quantity || 0}</td>
                                                                                <td>
                                                                                    {new Intl.NumberFormat("vi-VN", {
                                                                                        style: "currency",
                                                                                        currency: "VND",
                                                                                    }).format(item.unit_price)}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <td colSpan={3}>
                                                                                <strong>Tổng cộng</strong>
                                                                            </td>
                                                                            <td>
                                                                                <h5 className="fw-bold">
                                                                                    {new Intl.NumberFormat("vi-VN", {
                                                                                        style: "currency",
                                                                                        currency: "VND",
                                                                                    }).format(product.reduce((total, item) => total + item.unit_price * item.quantity, 0)) || data.total}
                                                                                </h5>
                                                                            </td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </Table>
                                                            ) : (
                                                                <p className="text-center text-muted">Không có sản phẩm nào được chọn.</p>
                                                            )}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col xs={12} md={4}>
                                            <Row className="row-gap-3">
                                                <Col xs={12}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title className="text-primary">Thông tin Khách hàng</Card.Title>
                                                            <>
                                                                <p>
                                                                    <strong>Tên:</strong> {data.name}
                                                                </p>
                                                                <p>
                                                                    <strong>Email:</strong> <a href={`mailto:${data.email}`}>{data.email}</a>
                                                                </p>
                                                                <p>
                                                                    <strong>Số điện thoại: </strong>
                                                                    {data.phone ? (
                                                                        <a href={"tel:" + data?.phone} className="text-decoration-none">
                                                                            {data?.phone?.toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
                                                                        </a>
                                                                    ) : (
                                                                        "Không có SĐT"
                                                                    )}
                                                                </p>
                                                                <p>
                                                                    <strong>Địa chỉ:</strong> {data.address || "Không có"}
                                                                </p>
                                                            </>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={12}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title className="text-primary">Thông tin khác</Card.Title>
                                                            <p>
                                                                <strong>Tên khác:</strong> {data.name_other || "Không có tên người nhận khác"}
                                                            </p>
                                                            <p>
                                                                <strong>Email khác:</strong> <a href={`mailto:${data.email}`}>{data.email_other || "Không có địa chỉ email khác"}</a>
                                                            </p>
                                                            <p>
                                                                <strong>Số điện thoại khác:</strong>{" "}
                                                                {data.phone_other ? (
                                                                    <a href={"tel:" + data?.phone_other} className="text-decoration-none">
                                                                        {data?.phone_other?.toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
                                                                    </a>
                                                                ) : (
                                                                    "Không có SĐT khác"
                                                                )}
                                                            </p>
                                                            <p>
                                                                <strong>Địa chỉ khác:</strong> {data.address_other || "Không có địa chỉ khác"}
                                                            </p>
                                                            <p>
                                                                <strong>Ghi chú khác:</strong> {data.note_other || "Không có ghi chú khác"}
                                                            </p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form>
                            </Box>
                        </Col>
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Edit;
