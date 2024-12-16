import React from "react";
import Layout from "../Layouts/Index";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { router } from "@inertiajs/react";
import { Badge, Button, Card, Col, Container, ListGroup, ProgressBar, Row } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

function Home({
    products,
    services,
    currentMonthProductRevenue,
    currentMonthServiceRevenue,
    productRevenuePercentageChange,
    serviceRevenuePercentageChange,
    newOrdersCount,
    newBookingCount,
    bestSellingProduct,
    bestSellingService,
    latestProductOrders,
    latestServiceBills,
}) {
    const formatCurrency = (value) => {
        if (isNaN(value)) {
            return "0 VND";
        }
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };

    const productData = products.monthly_revenue.map((item) => ({
        name: `Tháng ${item.month}`,
        value: item.revenue && !isNaN(item.revenue) ? item.revenue : 0,
    }));

    const maxProductValue = Math.max(...productData.map((item) => item.value));
    const maxProductY = maxProductValue * 1.2;

    const serviceData = services.monthly_revenue.map((item) => ({
        name: `Tháng ${item.month}`,
        value: item.revenue && !isNaN(item.revenue) ? item.revenue : 0,
    }));

    const maxServiceValue = Math.max(...serviceData.map((item) => item.value));
    const maxServiceY = maxServiceValue * 1.2;

    // Dữ liệu biểu đồ tròn
    const totalRevenueProduct = products.revenue_year;
    const totalRevenueService = services.revenue_year;

    const pieData = [
        { name: "Sản phẩm", value: totalRevenueProduct },
        { name: "Dịch vụ", value: totalRevenueService },
    ];

    const COLORS = ["#0088FE", "#00C49F"];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const notify = () => toast("Đây là 1 thông báo để test !");

    const handleinfo = (uid, route) => {
        router.visit(`/admin/${route}/${uid}/edit`, {
            method: "get",
        });
    };
    const handleList = (route) => {
        router.visit(`/admin/${route}`, {
            method: "get",
        });
    };

    return (
        <>
            <Helmet>
                <title>Trang quản trị</title>
                <meta name="description" content="Trang quản trị" />
            </Helmet>
            <Layout>
                <Container fluid>
                    <h1>Home</h1>
                    <div className="mb-5">
                        <Button onClick={notify}>Notify !</Button>
                    </div>
                    <Row className="g-4">
                        {/* Thẻ tổng quan */}
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        Doanh thu sản phẩm
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="ms-2 float-end text-decoration-none"
                                            onClick={() => handleList("dailyProductRevenues")}
                                            title="Xem chi tiết trong tháng"
                                        >
                                            Xem Chi Tiết
                                        </Button>
                                    </Card.Title>
                                    <Card.Text className="h3">
                                        {formatCurrency(currentMonthProductRevenue)}{" "}
                                        <Badge className="float-end" bg={productRevenuePercentageChange >= 0 ? "success" : "danger"}>
                                            {productRevenuePercentageChange >= 0 ? "+" : "-"}
                                            {Math.abs(productRevenuePercentageChange).toFixed(2)}%
                                        </Badge>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        Doanh thu dịch vụ
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="ms-2 float-end text-decoration-none"
                                            onClick={() => handleList("dailyServiceRevenues")}
                                            title="Xem chi tiết trong tháng"
                                        >
                                            Xem Chi Tiết
                                        </Button>
                                    </Card.Title>
                                    <Card.Text className="h3">
                                        {formatCurrency(currentMonthServiceRevenue)}{" "}
                                        <Badge className="float-end" bg={serviceRevenuePercentageChange >= 0 ? "success" : "danger"}>
                                            {serviceRevenuePercentageChange >= 0 ? "+" : "-"}
                                            {Math.abs(serviceRevenuePercentageChange).toFixed(2)}%
                                        </Badge>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Đơn hàng mới trong ngày</Card.Title>
                                    <Card.Text className="h3">{newOrdersCount}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Lịch booking mới trong ngày</Card.Title>
                                    <Card.Text className="h3">{newBookingCount}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4}>
                            <Card className="shadow-sm border-left-primary mb-3">
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xs={4}>
                                            <img src={"/storage/gallery/" + bestSellingProduct?.image} alt={bestSellingProduct?.name} className="img-fluid rounded" style={{ maxHeight: "80px" }} />
                                        </Col>
                                        <Col xs={8}>
                                            <Card.Title className="text-uppercase text-muted mb-1">Sản phẩm bán chạy</Card.Title>
                                            <Card.Text className="h5 mb-0">{bestSellingProduct?.name}</Card.Text>
                                            <Card.Text className="text-muted mb-0">
                                                <strong>Số lượng đã bán:</strong> {bestSellingProduct?.total_quantity}
                                            </Card.Text>
                                            <Card.Text className="text-muted">
                                                <strong>Giá:</strong> {formatCurrency(bestSellingProduct?.price)}
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Card className="shadow-sm border-left-primary mb-3">
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xs={4}>
                                            <img src={"/storage/gallery/" + bestSellingService?.image} alt={bestSellingService?.name} className="img-fluid rounded" style={{ maxHeight: "80px" }} />
                                        </Col>
                                        <Col xs={8}>
                                            <Card.Title className="text-uppercase text-muted mb-1">Dịch vụ được đặt nhiều</Card.Title>
                                            <Card.Text className="h5 mb-0">{bestSellingService?.name}</Card.Text>
                                            <Card.Text className="text-muted mb-0">
                                                <strong>Số lần đặt:</strong> {bestSellingService?.total_orders}
                                            </Card.Text>
                                            <Card.Text className="text-muted">
                                                <strong>Giá:</strong> {formatCurrency(bestSellingService?.price)}
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Hoạt động gần đây */}
                        <Col xs={12} md={4}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        Danh sách đơn hàng sản phẩm mới
                                        <Button variant="link" className="float-end text-decoration-none" onClick={() => handleList("bills")} title="xem thêm đơn hàng">
                                            Xem thêm
                                        </Button>
                                    </Card.Title>
                                    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                                        {latestProductOrders.map((order) => (
                                            <li key={order.id} style={{ marginBottom: "5px" }}>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        handleinfo(order.uid, "bills");
                                                    }}
                                                    className="text-decoration-none"
                                                    style={{ color: "black" }}
                                                    title="Chi tiết đơn hàng"
                                                >
                                                    #{order.uid} - {new Date(order.created_at).toLocaleDateString()} - {formatCurrency(order.total)}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center">
                                        Danh sách hóa đơn dịch vụ mới
                                        <Button variant="link" className="float-end text-decoration-none" onClick={() => handleList("bills-services")} title="xem thêm hóa đơn">
                                            Xem thêm
                                        </Button>
                                    </Card.Title>
                                    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                                        {latestServiceBills.map((bill) => (
                                            <li key={bill.id} style={{ marginBottom: "5px" }}>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        handleinfo(bill.uid, "bills-services");
                                                    }}
                                                    className="text-decoration-none"
                                                    style={{ color: "black" }}
                                                    title="Chi tiết đơn hàng"
                                                >
                                                    #{bill.uid} - {new Date(bill.created_at).toLocaleDateString()} - {formatCurrency(bill.total)}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Biểu đồ tròn */}
                        <Col xs={12} md={4}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>So sánh doanh thu</Card.Title>
                                    <PieChart width={300} height={250}>
                                        <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} fill="#8884d8" dataKey="value">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="g-4 mt-4">
                        {/* Biểu đồ */}
                        {/* Biểu đồ đường */}
                        <Col xs={12} md={6}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Doanh thu sản phẩm trong năm</Card.Title>
                                    <LineChart width={730} height={250} data={productData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, maxProductY]} />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Legend />
                                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                    </LineChart>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Doanh thu dịch vụ trong năm</Card.Title>
                                    <LineChart width={730} height={250} data={serviceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, maxServiceY]} />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Legend />
                                        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                                    </LineChart>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Layout>
        </>
    );
}

export default Home;
