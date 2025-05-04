import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Layout from "@/Layouts/Index";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";

function Edit({ bookings, crumbs }) {
    const [customer, setCustomer] = useState({});
    const [user, setUser] = useState({});
    const [services, setServices] = useState([]);
    const [status, setStatus] = useState(0);
    const [note, setNote] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [arrivalDate, setArrivalDate] = useState("");

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);
        const seconds = ("0" + date.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleBack = () => {
        setCustomer({});
        setUser({});
        setServices([]);
        setStatus(0);
        setNote("");
        setArrivalDate("");
        setBookingDate("");
        router.visit("/admin/bookings", {
            method: "get",
        });
    };
    console.log(bookings.time);

    useEffect(() => {
        if (bookings) {
            setCustomer(bookings.customer);
            setUser(bookings.user);
            setServices(bookings.service);
            setStatus(bookings.status);
            setNote(bookings.note);
            setArrivalDate(bookings.time ? formatDateTime(bookings.time) : "");
            setBookingDate(formatDateTime(bookings.created_at));
        }
    }, [bookings]);

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
                                                            <Card.Title className="text-primary">Thông tin Booking</Card.Title>
                                                            <Form.Group className="mb-3" controlId="note">
                                                                <Form.Label>Ghi chú</Form.Label>
                                                                <Form.Control as="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ghi chú..." disabled />
                                                            </Form.Group>
                                                            <Form.Group className="mb-3" controlId="status">
                                                                <Form.Label>Trạng thái</Form.Label>
                                                                <Form.Select value={status} onChange={(e) => setStatus(Number(e.target.value))} disabled>
                                                                    <option value={0}>Chưa xếp nhân viên</option>
                                                                    <option value={1}>Đã xếp nhân viên</option>
                                                                    <option value={2}>Đang thực hiện</option>
                                                                    <option value={3}>Đã xong</option>
                                                                    <option value={4}>Đã thanh toán</option>
                                                                    <option value={5}>Lịch đã hủy</option>
                                                                </Form.Select>
                                                            </Form.Group>
                                                            <Row className="mb-3">
                                                                {/* Ngày đặt */}
                                                                <Col md={6}>
                                                                    <Form.Group controlId="bookingDate">
                                                                        <Form.Label>Ngày đặt</Form.Label>
                                                                        <Form.Control type="date" value={bookingDate ? bookingDate.split(" ")[0] : ""} readOnly disabled />
                                                                    </Form.Group>
                                                                </Col>
                                                                {/* Giờ đặt */}
                                                                <Col md={6}>
                                                                    <Form.Group controlId="bookingTime">
                                                                        <Form.Label>Giờ đặt</Form.Label>
                                                                        <Form.Control type="time" value={bookingDate ? bookingDate.split(" ")[1] : ""} readOnly disabled />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            <Row className="mb-3">
                                                                {/* Ngày đến */}
                                                                <Col md={6}>
                                                                    <Form.Group controlId="arrivalDate">
                                                                        <Form.Label>Ngày đến</Form.Label>
                                                                        <Form.Control type="date" value={arrivalDate ? arrivalDate.split(" ")[0] : ""} readOnly disabled />
                                                                    </Form.Group>
                                                                </Col>
                                                                {/* Giờ đến */}
                                                                <Col md={6}>
                                                                    <Form.Group controlId="arrivalTime">
                                                                        <Form.Label>Giờ đến</Form.Label>
                                                                        <Form.Control type="time" value={arrivalDate ? arrivalDate.split(" ")[1] : ""} readOnly disabled />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={12}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title className="text-primary">Danh sách Dịch vụ</Card.Title>
                                                            {services && services.length > 0 ? (
                                                                <Table striped bordered hover responsive>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Tên Dịch vụ</th>
                                                                            <th>Giá</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {services.map((service, index) => (
                                                                            <tr key={service.id}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{service.name}</td>
                                                                                <td>{service.price.toLocaleString()} VND</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            ) : (
                                                                <p className="text-center text-muted">Không có dịch vụ nào được chọn.</p>
                                                            )}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Col>

                                        {/* Thông tin Khách hàng & nhân viên */}
                                        <Col xs={12} md={4}>
                                            <Row className="row-gap-3">
                                                <Col xs={12}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title className="text-primary">Thông tin Khách hàng</Card.Title>
                                                            {customer ? (
                                                                <>
                                                                    <p>
                                                                        <strong>Tên:</strong> {customer.name}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Email:</strong> <a href={`mailto:${customer.email}`}>{customer.email}</a>
                                                                    </p>
                                                                    <p>
                                                                        <strong>Số điện thoại:</strong> {customer.phone || "Không có"}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Địa chỉ:</strong> {customer.address || "Không có"}
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <p>Không có thông tin khách hàng.</p>
                                                            )}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                {status !== 0 && (
                                                    <Col xs={12}>
                                                        <Card>
                                                            <Card.Body>
                                                                <Card.Title className="text-primary">Thông tin Nhân viên</Card.Title>
                                                                {user ? (
                                                                    <>
                                                                        <p>
                                                                            <strong>Tên:</strong> {user.name}
                                                                        </p>
                                                                        <p>
                                                                            <strong>Email:</strong> <a href={`mailto:${user.email}`}>{user.email}</a>
                                                                        </p>
                                                                        <p>
                                                                            <strong>Số điện thoại:</strong> {user.phone || "Không có"}
                                                                        </p>
                                                                        <p>
                                                                            <strong>Địa chỉ:</strong> {user.address || "Không có"}
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <p>Không có thông tin nhân viên.</p>
                                                                )}
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                )}
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
