import React, { useState, useMemo, useEffect } from "react";
import Layout from "@/Layouts/Index";
import { Button, Col, Row } from "react-bootstrap";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Helmet } from "react-helmet";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";

function Index({ bills, crumbs }) {
    const [data, setData] = useState([]);
    const [crumbsData, setCrumbsData] = useState(crumbs || []);

    const handleView = (uid) => {
        router.visit("/admin/bills/" + uid + "/edit", {
            method: "get",
        });
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
                <>
                    <p>{params.row.customer ? params.row.name : ""}</p>
                </>
            ),
        },
        {
            field: "phone",
            headerName: "SĐT",
            width: 130,
            renderCell: (params) => (
                <span>
                    {params.row.customer ? (
                        <a href={"tel:" + params.row?.phone} className="text-decoration-none">
                            {params.row?.phone?.toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
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
                        statusIcon = "bi bi-person-chec";
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
                    <>
                        <div className={statusClass} title={params.row.transaction_id !== null ? "Đã thanh toán online" : "Trạng thái hóa đơn"}>
                            <i class={statusIcon + " me-1"} width="24" height="16" />
                            <span>{statusText}</span>
                        </div>
                    </>
                );
            },
        },
        {
            field: "id_product",
            headerName: "Sản phẩm",
            width: 240,
            renderCell: (params) => (
                <>
                    <span title={params.row.bill_detail && params.row.bill_detail.map((item) => item.product?.name).join(", ")}>
                        {params.row.bill_detail && params.row.bill_detail.map((item) => item.product?.name).join(", ")}
                    </span>
                </>
            ),
        },
        {
            field: "total",
            headerName: "Tổng",
            width: 140,
            renderCell: (params) => {
                return new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(params.value);
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 160,
            renderCell: (params) => (
                <>
                    <span>{new Date(params.row.created_at).toLocaleString()}</span>
                </>
            ),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 100,
            renderCell: (params) => (
                <Button type="button" variant="outline-info" title="Xem chi tiết hóa đơn" onClick={() => handleView(params.row.uid)}>
                    <i className="bi bi-exclamation-circle" />
                </Button>
            ),
        },
    ]);

    useEffect(() => {
        setData(bills);
    }, [bills]);

    return (
        <>
            <Helmet>
                <title>Danh sách Hóa Đơn</title>
                <meta name="description" content="Danh sách hóa đơn" />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbsData}>
                        </BreadcrumbComponent>

                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách hóa đơn</h4>
                                </div>
                                <DataGrid
                                    rows={data}
                                    columns={columns}
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
                                    // onCellEditStop={(params, e) => {
                                    //     handleCellEditStop(params.row.id, params.field, e.target.value);
                                    // }}
                                    // onCellEditStart={(params, e) => {
                                    //     handleCellEditStart(params.row.id, params.field, e.target.value);
                                    // }}
                                    pageSizeOptions={[20, 40, 60, 80, 100]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </Col>
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
