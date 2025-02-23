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

    useEffect(() => {
        const formattedData = dailyRevenues.map((item, index) => ({
            ...item,
            id: item.date,
        }));
        setData(formattedData);
    }, [dailyRevenues]);

    console.log(data);

    const formatCurrency = (value) => {
        if (isNaN(value)) {
            return "0 VND";
        }
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };
    const handleView = (date, route) => {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        router.visit(`/admin/${route}/${formattedDate}/edit`, {
            method: "get",
        });
    };

    const columns = useMemo(() => [
        {
            field: "date",
            headerName: "Ngày",
            width: 160,
            renderCell: (params) => <p>{new Date(params.row.date).toLocaleDateString()}</p>,
        },
        {
            field: "daily_revenue",
            headerName: "Doanh thu",
            width: 180,
            renderCell: (params) => <p>{formatCurrency(params.row.daily_revenue)}</p>,
        },
        {
            field: "quality",
            headerName: "Số lượng hóa đơn",
            width: 180,
            renderCell: (params) => <p>{params.row.quality}</p>,
        },
        {
            field: "avt",
            headerName: "Trung bình trên bill",
            width: 180,
            renderCell: (params) => <p>{formatCurrency(params.row.daily_revenue / params.row.quality)}</p>,
        },
        {
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
                        handleView(params.row.id, route);
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
                        <BreadcrumbComponent props={crumbsData}></BreadcrumbComponent>

                        {/* Start DataGrid */}
                        <Col xs={12} md={12}>
                            <Row className="g-4">
                                <Col xs={12}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title className="text-primary">Doanh thu tháng {new Date().getMonth() + 1}</Card.Title>
                                            {/* Kiểm tra có phương thức thanh toán không */}
                                            {data?.[0]?.payment_method_totals
                                                ? (() => {
                                                      const paymentTotals = {};

                                                      data?.forEach((specificData) => {
                                                          if (specificData.payment_method_totals) {
                                                              Object.entries(specificData.payment_method_totals).forEach(([method, details]) => {
                                                                  // Đổi tên phương thức thanh toán
                                                                  const paymentMethodName = method === "0" ? "Tiền mặt" : method === "1" ? "Chuyển khoản" : method;

                                                                  if (paymentTotals[paymentMethodName]) {
                                                                      paymentTotals[paymentMethodName] += details.total_by_payment_method;
                                                                  } else {
                                                                      paymentTotals[paymentMethodName] = details.total_by_payment_method;
                                                                  }
                                                              });
                                                          }
                                                      });

                                                      const totalAmount = Object.values(paymentTotals).reduce((acc, curr) => acc + curr, 0);

                                                      return (
                                                          <>
                                                              <p>
                                                                  <strong>Tổng tiền:</strong>{" "}
                                                                  {totalAmount.toLocaleString("vi-VN", {
                                                                      style: "currency",
                                                                      currency: "VND",
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
                                                : (() => {
                                                      const totalRevenue = data?.reduce((acc, specificData) => acc + (specificData.daily_revenue || 0), 0);

                                                      return (
                                                          <p>
                                                              <strong>Tổng tiền:</strong>{" "}
                                                              {totalRevenue.toLocaleString("vi-VN", {
                                                                  style: "currency",
                                                                  currency: "VND",
                                                              })}
                                                          </p>
                                                      );
                                                  })()}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Row className="g-2 mt-1 mb-5">
                                <Col xs={12}>
                                    <Box sx={{ height: "70vh", width: "100%" }}>
                                        <div className="text-start mb-4">
                                            {" "}
                                            {/* Tăng margin-bottom cho tiêu đề */}
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
