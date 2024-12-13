import React, { useState, useMemo, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Layout from "@/Layouts/Index";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";

function Edit({ dailyRevenues, crumbs, date }) {
    const [data, setData] = useState([]);
    const [product, setProduct] = useState([]);
    const [status, setStatus] = useState("");
    const [name1, setName1] = useState("Phương thức thanh toán");
    const [route, setRoute] = useState("bills");

    const handleBack = () => {
        setData([]);
        setProduct([]);
        setStatus("");
        router.visit("/admin/dailyProductRevenues", {
            method: "get",
        });
    };
    const handleView = (uid, route) => {
        router.visit("/admin/" + route + "/" + uid + "/edit", {
            method: "get",
        });
    };

    const dateKey = date;
    const specificData = data?.[dateKey];
    const formatPrice = (params) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(params);
    };

    const columns = useMemo(() => [
        {
            field: "uid",
            headerName: "Mã hóa đơn",
            width: 140,
        },
        {
            field: "customer_id",
            headerName: "Khách hàng",
            width: 160,
            renderCell: (params) => (
                <p>{params.row.customer ? params.row.customer?.name : ""}</p>
            ),
        },
        {
            field: "phone",
            headerName: "SĐT",
            width: 130,
            renderCell: (params) => (
                <span>
                    {params.row.customer ? (
                        <a href={"tel:" + params.row.customer?.phone} className="text-decoration-none">
                            {params.row.customer?.phone?.toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
                        </a>
                    ) : (
                        "Không có SĐT"
                    )}
                </span>
            ),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 160,
            renderCell: (params) => {
                let statusText = "";
                let statusClass = "";
                let statusIcon = "";
                switch (params.row.status) {
                    case 0:
                        statusText = "Đang chờ xử lý";
                        statusClass = "text-warning";
                        statusIcon = "bi bi-clock";
                        break;
                    case 1:
                        statusText = "Đã xác nhận";
                        statusClass = "text-primary";
                        statusIcon = "bi bi-check-circle-fill";
                        break;
                    case 2:
                        statusText = "Đã giao đơn vị vận chuyển";
                        statusClass = "text-info";
                        statusIcon = "bi bi-person-check";
                        break;
                    case 3:
                        statusText = "Đang giao hàng";
                        statusClass = "text-info";
                        statusIcon = "bi bi-truck";
                        break;
                    case 4:
                        statusText = "Đã giao hàng";
                        statusClass = "text-success";
                        statusIcon = "bi bi-cart-check-fill";
                        break;
                    case 5:
                        statusText = "Khách hàng từ chối nhận hàng";
                        statusClass = "text-danger";
                        statusIcon = "bi bi-exclamation-diamond-fill";
                        break;
                    case 6:
                        statusText = "Đã hoàn trả";
                        statusClass = "text-dark";
                        statusIcon = "bi bi-x-circle";
                        break;
                    default:
                        statusText = "Chưa xác định";
                        statusClass = "text-muted";
                        statusIcon = "bi bi-question-circle";
                }
                return (
                    <div className={statusClass} title={params.row.transaction_id !== null ? "Đã thanh toán online" : "Trạng thái hóa đơn"}>
                        <i className={statusIcon + " me-1"} width="24" height="16" />
                        <span>{statusText}</span>
                    </div>
                );
            },
        },
        {
            field: "total",
            headerName: "Tổng",
            width: 120,
            renderCell: (params) => {
                return new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(params.value);
            },
        },
        {
            field: "payment_method",
            headerName: name1,
            width: 180,
            renderCell: (params) => {
                const value = params.row.booking ? params.row.booking.time : params.row.payment_method;
                return <span>{value}</span>;
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 160,
            renderCell: (params) => (
                <span>{new Date(params.row.created_at).toLocaleString()}</span>
            ),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 100,
            renderCell: (params) => (
                <Button type="button" variant="outline-info" title="Xem chi tiết hóa đơn" onClick={() => handleView(params.row.uid, route)}>
                    <i className="bi bi-exclamation-circle" />
                </Button>
            ),
        },
    ], [name1]); // Re-run useMemo when name1 changes

    useEffect(() => {
        setData(dailyRevenues);
        const dateKey = date;
        const specificData = dailyRevenues?.[dateKey];
        const mappedBills = specificData?.bills?.map((item, index) => ({
            ...item,
            id: item.uid || index,
        }));
        setProduct(mappedBills || []);
        if (specificData && specificData.bills) {
            setName1(specificData.bills[0].booking ? "Ngày đến" : "Phương thức thanh toán");
            setRoute(specificData.bills[0].booking ? "bills-services" : "bills");
        }
    }, [dailyRevenues, date]);


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
                                    <h4>Chi tiết doanh thu trong ngày</h4>
                                </div>
                                <Form encType="multipart/form-data">
                                    <Row className="row-gap-3">
                                        {/* Thông tin Booking */}
                                        <Col xs={12} md={12}>
                                            <Row className="row-gap-3">
                                                <Col xs={12}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Card.Title className="text-primary">Thông tin chi tiết doanh thu trong ngày</Card.Title>
                                                            <Form.Group className="mb-3" controlId="code">
                                                                <Form.Label>Ngày</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={specificData?.date || "Không có mã hóa đơn"}
                                                                    readOnly
                                                                    disabled
                                                                />
                                                            </Form.Group>
                                                            <Form.Group className="mb-3" controlId="code">
                                                                <Form.Label>Tổng doanh thu</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={formatPrice(specificData?.total) || 0}
                                                                    readOnly
                                                                    disabled
                                                                />
                                                            </Form.Group>
                                                            <Row className="row-gap-3">
                                                                {specificData?.payment_method_totals
                                                                    ? Object.entries(specificData.payment_method_totals).map(([method, details], index) => (
                                                                        <React.Fragment key={index}>
                                                                            <Col md={6}>
                                                                                <Form.Group className="mb-3" controlId={`payment-${method}`}>
                                                                                    <Form.Label>Phương thức thanh toán</Form.Label>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        value={method}
                                                                                        readOnly
                                                                                        disabled
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col md={6}>
                                                                                <Form.Group className="mb-3" controlId={`paymentTotal-${method}`}>
                                                                                    <Form.Label>Tổng tiền</Form.Label>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        value={details?.total_by_payment_method?.toLocaleString('vi-VN', {
                                                                                            style: 'currency',
                                                                                            currency: 'VND',
                                                                                        }) || "Không có tổng tiền"}
                                                                                        readOnly
                                                                                        disabled
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </React.Fragment>
                                                                    ))
                                                                    : <p>Không có dữ liệu phương thức thanh toán</p>}
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={12}>
                                                    <Card>
                                                        <Card.Body>
                                                            <Box sx={{ height: "70vh", width: "100%" }}>
                                                                <DataGrid
                                                                    rows={product || []} // Dữ liệu sản phẩm
                                                                    columns={columns}    // Cấu hình cột
                                                                    slots={{
                                                                        toolbar: GridToolbar,
                                                                    }}
                                                                    slotProps={{
                                                                        toolbar: {
                                                                            showQuickFilter: true,
                                                                            quickFilterProps: {
                                                                                debounceMs: 500,
                                                                            },
                                                                        },
                                                                    }}
                                                                    initialState={{
                                                                        pagination: {
                                                                            paginationModel: {
                                                                                pageSize: 20,
                                                                            },
                                                                        },
                                                                    }}
                                                                    pageSizeOptions={[20, 40, 60, 80, 100]}
                                                                    checkboxSelection
                                                                    disableRowSelectionOnClick
                                                                />
                                                            </Box>
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
