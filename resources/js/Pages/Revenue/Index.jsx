import React, { useState, useMemo, useEffect } from "react";
import Layout from "@/Layouts/Index";
import { Button, Col, Row, Card } from "react-bootstrap";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Helmet } from "react-helmet";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";

function Index({ dailyRevenues, crumbs }) {
    const [data, setData] = useState([]);
    const [crumbsData, setCrumbsData] = useState(crumbs || []);

    // Thêm id cho mỗi dòng dữ liệu, sử dụng 'date' làm id duy nhất hoặc tạo một trường id khác
    useEffect(() => {
        const formattedData = dailyRevenues.map((item, index) => ({
            ...item,
            id: item.date, // Dùng 'date' làm id duy nhất hoặc index nếu cần
        }));
        setData(formattedData);
    }, [dailyRevenues]);

    const formatCurrency = (value) => {
        if (isNaN(value)) {
            return "0 VND";
        }
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };
    const handleView = (date, route) => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        router.visit(`/admin/${route}/${formattedDate}/edit`, {
            method: 'get',
        });
    };

    const columns = useMemo(() => [
        {
            field: "date",
            headerName: "Ngày",
            width: 160,
            renderCell: (params) => (
                <p>{new Date(params.row.date).toLocaleDateString()}</p>
            ),
        },
        {
            field: "daily_revenue",
            headerName: "Doanh thu",
            width: 180,
            renderCell: (params) => (
                <p>{formatCurrency(params.row.daily_revenue)}</p>
            ),
        },
        {
            field: "quality",
            headerName: "Số lượng hóa đơn",
            width: 180,
            renderCell: (params) => (
                <p>{params.row.quality}</p>
            ),
        }, {
            field: "action",
            headerName: "Thao tác",
            width: 150,
            renderCell: (params) => (
                <Button
                    type="button"
                    variant="outline-info"
                    title="Xem chi tiết doanh thu theo ngày"
                    onClick={() => {
                        const route = params.row.payment_method_totals ? "dailyProductRevenues" : "dailyServiceRevenues";
                        handleView(params.row.id, route);  // Gọi handleView với route thích hợp
                    }}
                >
                    <i className="bi bi-exclamation-circle" />
                </Button>
            ),
        },

    ]);

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
                        <Col xs="8">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách Hóa Đơn</h4>
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
                                    pageSizeOptions={[20, 40, 60, 80, 100]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </Col>
                        <Col xs={12} md={4}>
                            <Row className="row-gap-3">
                                <Col xs={12}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title className="text-primary">
                                                Doanh thu tháng {data?.[0]?.date ? new Date(data[0].date).getMonth() + 1 : "N/A"}
                                            </Card.Title>

                                            {/* Kiểm tra có phương thức thanh toán không */}
                                            {data?.[0]?.payment_method_totals ? (
                                                // Trường hợp có payment_method_totals
                                                (() => {
                                                    const paymentTotals = {};

                                                    // Tính tổng tiền của mỗi phương thức thanh toán từ tất cả các ngày
                                                    data?.forEach(specificData => {
                                                        if (specificData.payment_method_totals) {
                                                            Object.entries(specificData.payment_method_totals).forEach(([method, details]) => {
                                                                if (paymentTotals[method]) {
                                                                    paymentTotals[method] += details.total_by_payment_method;
                                                                } else {
                                                                    paymentTotals[method] = details.total_by_payment_method;
                                                                }
                                                            });
                                                        }
                                                    });

                                                    const totalAmount = Object.values(paymentTotals).reduce((acc, curr) => acc + curr, 0);

                                                    return (
                                                        <>
                                                            <p>
                                                                <strong>Tổng tiền:</strong> {totalAmount.toLocaleString('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND',
                                                                })}
                                                            </p>
                                                            <p>
                                                                <strong>Phương thức thanh toán:</strong>
                                                                {Object.entries(paymentTotals).map(([method, total], idx) => (
                                                                    <div key={idx}>
                                                                        {method}: {formatCurrency(parseFloat(total))}
                                                                    </div>
                                                                ))}
                                                            </p>
                                                        </>
                                                    );
                                                })()
                                            ) : (
                                                // Trường hợp không có payment_method_totals mà có daily_revenue
                                                (() => {
                                                    const totalRevenue = data?.reduce((acc, specificData) => acc + (specificData.daily_revenue || 0), 0);

                                                    return (
                                                        <p>
                                                            <strong>Tổng tiền:</strong> {totalRevenue.toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })}
                                                        </p>
                                                    );
                                                })()
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>

                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
