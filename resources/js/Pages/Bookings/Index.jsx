import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/Layouts/Index";
import { Button, Col, Row } from "react-bootstrap";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Helmet } from "react-helmet";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import Echo from "laravel-echo";
import axios from "axios";
import { router } from "@inertiajs/react";
import Pusher from "pusher-js";

function Index({ bookings, crumbs }) {
    const [data, setData] = useState(bookings || []);
    const [crumbsData, setCrumbsData] = useState(crumbs || []);

    const handleView = (id) => {
        console.log("Hello: ", id);

        router.visit("/admin/bookings/" + id + "/edit", {
            method: "get",
        });
    };

    const columns = useMemo(() => [
        {
            field: "time",
            headerName: "Thời gian đến",
            width: 160,
            renderCell: (params) => new Date(params.row.time).toLocaleString(),
        },

        {
            field: "id_customer",
            headerName: "Khách hàng",
            width: 160,
            renderCell: (params) => (
                <>
                    <p>{params.row.customer ? params.row.customer.name : ""}</p>
                </>
            ),
        },
        {
            field: "phone",
            headerName: "SĐT",
            width: 120,
            renderCell: (params) => (
                <span>
                    {params.row.customer ? (
                        <a href={"tel:" + params.row?.phone} className="text-decoration-none">
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
            width: 180,
            renderCell: (params) => {
                let statusText = "";
                let statusClass = "";
                switch (params.row.status) {
                    case 0:
                        statusText = "Đang chờ xếp nhân viên";
                        statusClass = "text-warning";
                        break;
                    case 1:
                        statusText = "Đã xếp nhân viên";
                        statusClass = "text-primary";
                        break;
                    case 2:
                        statusText = "Đang thực hiện";
                        statusClass = "text-info";
                        break;
                    case 3:
                        statusText = "Thành công";
                        statusClass = "text-success";
                        break;
                    case 4:
                        statusText = "Đã thanh toán";
                        statusClass = "text-success";
                        break;
                    case 5:
                        statusText = "Thất bại";
                        statusClass = "text-danger";
                        break;
                    default:
                        statusText = "Chưa xác định";
                }
                return <span className={statusClass}>{statusText}</span>;
            },
        },
        {
            field: "service",
            headerName: "Dịch vụ",
            width: 340,
            renderCell: (params) => (
                <>
                    <span title={params.row.service && params.row.service.map((item) => item.name).join(", ")}>{params.row.service && params.row.service.map((item) => item.name).join(", ")}</span>
                </>
            ),
        },
        {
            field: "id_user",
            headerName: "Nhân viên thực hiện",
            width: 160,
            renderCell: (params) => (
                <>
                    <p>{params.row.user ? params.row.user.name : "Chưa sắp xếp nhân viên"}</p>
                </>
            ),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 100,
            renderCell: (params) => (
                <Button type="button" variant="outline-info" title="Xem chi tiết dịch vụ" onClick={() => handleView(params.row.id)}>
                    <i className="bi bi-exclamation-circle" />
                </Button>
            ),
        },
    ]);

    const pusher = new Pusher("a41649538081bc522756", {
        cluster: "ap1",
        wsHost: "ws-ap1.pusher.com",
        wsPort: 443,
        wssPort: 443,
        forceTLS: true,
        enabledTransports: ["ws", "wss"],
        disableStats: true,
        encrypted: true,
    });

    useEffect(() => {
        var channel = pusher.subscribe("channelBookings");

        channel.bind("BookingCreated", function (response) {
            setData((prevData) => [response.bookingData, ...prevData]);
        });

        channel.bind("BookingUpdated", function (response) {
            setData((prevData) => {
                return prevData.map((booking) => (booking.id === response.bookingData.id ? response.bookingData : booking));
            });
            console.log("BookingUpdated: ", { ...response.bookingData });
        });
    }, []);

    return (
        <>
            <Helmet>
                <title>Danh sách lịch đặt</title>
                <meta name="description" content="Danh sách lịch đặt" />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbsData}>
                            <Button type="button" variant="primary" disabled={true}>
                                <i className="bi bi-plus-circle" />
                                <span className="ms-2">Thêm lịch đặt mới</span>
                            </Button>
                        </BreadcrumbComponent>

                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách lịch đặt</h4>
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
