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
        router.visit("/admin/bills-services/" + uid + "/edit", {
            method: "get",
        });
    };

    const columns = useMemo(() => [
        {
            field: "uid",
            headerName: "Mã hóa đơn",
            width: 200,
        },
        {
            field: "customer_id",
            headerName: "Khách hàng",
            width: 160,
            renderCell: (params) => (
                <>
                    <p>{params.row.customer?.name || "N/A"}</p>
                </>
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
                        statusClass = "text-success";
                        statusIcon = "bi bi-check-circle-fill";
                        break;
                    case 2:
                        statusText = "Đã hủy";
                        statusClass = "text-danger";
                        statusIcon = "bi bi-x-circle";
                        break;
                    default:
                        statusText = "Chưa xác định";
                        statusClass = "text-muted";
                        statusIcon = "bi bi-question-circle";
                }
                return (
                    <>
                        <div className={statusClass}>
                            <i className={statusIcon + " me-1"} />
                            <span>{statusText}</span>
                        </div>
                    </>
                );
            },
        },
        {
            field: "time",
            headerName: "Thời gian đến",
            width: 240,
            renderCell: (params) => (
                <>
                    <p>{params.row.booking?.time || "N/A"}</p>
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
                    <span>
                        {new Date(params.row.created_at).toLocaleString("vi-VN")}
                    </span>
                </>
            ),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 100,
            renderCell: (params) => (
                <Button
                    type="button"
                    variant="outline-info"
                    title="Xem chi tiết hóa đơn"
                    onClick={() => handleView(params.row.uid)}
                >
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
                            <Button type="button" variant="primary" disabled={true}>
                                <i className="bi bi-plus-circle" />
                                <span className="ms-2">Thêm hóa đơn mới</span>
                            </Button>
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
