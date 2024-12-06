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
    const [service, setService] = useState([]);
    const [status, setStatus] = useState("");

    const handleBack = () => {
        setData([]);
        setService([]);
        setStatus("");
        router.visit("/admin/bills-services", {
            method: "get",
        });
    };

    const handleStatusChange = (e) => {
        const newStatus = Number(e.target.value);
        setStatus(newStatus);
        setData({ ...data, status: newStatus });
    };

    const handleStatus = (e) => {
        e.preventDefault();
        axios
            .put("/admin/bills-services/" + data.uid, {
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
        setService(bill.service_bill_details);
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
                                                            <Form.Group className="mb-3" controlId="note">
                                                                <Form.Label>Ghi chú</Form.Label>
                                                                <Form.Control as="textarea" rows={3} value={data.booking?.note || "Không có nhập ghi chú"} placeholder="Ghi chú..." disabled />
                                                            </Form.Group>
                                                            <Row className="row-gap-3">
                                                                <Col>
                                                                    <Form.Group className="mb-3" controlId="status">
                                                                        <Form.Label>Trạng thái đơn hàng</Form.Label>
                                                                        <Form.Select value={data.status} onChange={handleStatusChange}>
                                                                            <option value={0}>Đang chờ xử lý</option>
                                                                            <option value={1}>Đã xác nhận</option>
                                                                            <option value={2}>Đã hủy</option>
                                                                        </Form.Select>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Group className="mb-3" controlId="transactionId">
                                                                        <Form.Label>Thời gian khách đến</Form.Label>
                                                                        <Form.Control type="text" value={data.booking?.time || "không có thời gian đến"} readOnly disabled />
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
                                                            <Card.Title className="text-primary">Danh sách dịch vụ</Card.Title>
                                                            {service && service.length > 0 ? (
                                                                <Table striped bordered hover responsive>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Tên dịch vụ</th>
                                                                            <th>Giá lúc đặt</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {service.map((item, index) => (
                                                                            <tr key={index}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{item.service?.name || "Không có tên dịch vụ"}</td>
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
                                                                            <td colSpan={2}>
                                                                                <strong>Tổng cộng</strong>
                                                                            </td>
                                                                            <td>
                                                                                <h5 className="fw-bold">
                                                                                    {new Intl.NumberFormat("vi-VN", {
                                                                                        style: "currency",
                                                                                        currency: "VND",
                                                                                    }).format(
                                                                                        service.reduce(
                                                                                            (sum, item) => sum + parseFloat(item.unit_price || 0),
                                                                                            0
                                                                                        )
                                                                                    )}
                                                                                </h5>
                                                                            </td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </Table>
                                                            ) : (
                                                                <p className="text-center text-muted my-4">
                                                                    <i className="bi bi-info-circle me-2"></i>Không có dịch vụ nào được chọn.
                                                                </p>
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
                                                                    <strong>Tên:</strong> {data.customer?.name || "Không có tên"}
                                                                </p>
                                                                <p>
                                                                    <strong>Email:</strong>{" "}
                                                                    <a
                                                                        href={`mailto:${data.customer?.email}`}
                                                                        className="text-decoration-none text-primary"
                                                                    >
                                                                        {data.customer?.email || "Không có email"}
                                                                    </a>
                                                                </p>
                                                                <p>
                                                                    <strong>Số điện thoại:</strong>{" "}
                                                                    {data.customer?.phone?.length === 10 ? (
                                                                        <a
                                                                            href={`tel:${data.customer.phone}`}
                                                                            className="text-decoration-none"
                                                                        >
                                                                            {data.customer.phone.replace(
                                                                                /(\d{3})(\d{3})(\d{4})/,
                                                                                "$1-$2-$3"
                                                                            )}
                                                                        </a>
                                                                    ) : (
                                                                        data.customer?.phone || "Không có SĐT"
                                                                    )}
                                                                </p>
                                                                <p>
                                                                    <strong>Địa chỉ:</strong>{" "}
                                                                    {data.customer?.address?.trim() || "Không có địa chỉ"}
                                                                </p>
                                                            </>
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
