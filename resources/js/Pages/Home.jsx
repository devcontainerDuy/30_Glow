import React from "react";
import Layout from "../Layouts/Index";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Badge, Button, Card, Col, Container, ListGroup, ProgressBar, Row } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

function Home({ products, services, totalUsers, totalNewUsersThisMonth, currentMonthRevenue, newOrdersCount, bestSellingProduct, latestProductOrders, latestServiceBills }) {

    const formatCurrency = (value) => {
        if (isNaN(value)) {
            return '0 VND';
        }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    const productData = products[0].monthly_revenue.map(item => ({
        name: `Tháng ${item.month}`,
        value: item.revenue && !isNaN(item.revenue) ? item.revenue : 0,
    }));

    const serviceData = services[0].monthly_revenue.map(item => ({
        name: `Tháng ${item.month}`,
        value: item.revenue && !isNaN(item.revenue) ? item.revenue : 0,
    }));

    const maxProductValue = Math.max(...productData.map(item => item.value));
    const maxServiceValue = Math.max(...serviceData.map(item => item.value));
    const maxProductY = maxProductValue * 1.2;
    const maxServiceY = maxServiceValue * 1.2;

    const totalRevenueProduct = products[0].revenue_year;
    const totalRevenueService = services[0].revenue_year;

    const pieData = [
        { name: "Sản phẩm", value: totalRevenueProduct },
        { name: "Dịch vụ", value: totalRevenueService },
    ];
    console.log(latestProductOrders);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

    const RADIAN = Math.PI / 360;
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
                    <Row className="g-4 d-flex align-items-stretch">
                        {/* Thẻ tổng quan */}
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Tổng số người dùng</Card.Title>
                                    <Card.Text className="h3">
                                        {totalUsers} <Badge bg="info">+{totalNewUsersThisMonth}</Badge>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Doanh thu tháng này</Card.Title>
                                    <Card.Text className="h3">{formatCurrency(currentMonthRevenue)}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Đơn hàng mới</Card.Title>
                                    <Card.Text className="h3">{newOrdersCount}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Earnings (Monthly)</Card.Title>
                                    <Card.Text className="h3">$40,000</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Bảng dữ liệu */}
                        <Col xs={12} sm={6} md={4}>
                            <Card className="shadow-sm border-left-primary">
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xs={4}>
                                            {/* Hiển thị hình ảnh sản phẩm */}
                                            <img
                                                src={asset(`/storage/services/${bestSellingProduct.product.gallery[0]?.image}`)}
                                                alt={bestSellingProduct.product.gallery[0]?.image}
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '80px' }}
                                            />
                                        </Col>
                                        <Col xs={8}>
                                            {/* Hiển thị thông tin sản phẩm */}
                                            <Card.Title className="text-uppercase text-muted mb-1">
                                                Sản phẩm bán chạy
                                            </Card.Title>
                                            <Card.Text className="h5 mb-0">{bestSellingProduct.product.name}</Card.Text>
                                            <Card.Text className="text-muted mb-0">
                                                <strong>Số lượng đã bán:</strong> {bestSellingProduct.total_quantity}
                                            </Card.Text>
                                            <Card.Text className="text-muted">
                                                <strong>Giá:</strong> {formatCurrency(bestSellingProduct.product.price)}
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xs={12} md={4}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Danh sách đơn hàng sản phẩm mới</Card.Title>
                                    <ul>
                                        {latestProductOrders.map((order) => (
                                            <li key={order.uid}>
                                                #{order.uid} - {new Date(order.created_at).toLocaleDateString()} - {formatCurrency(order.total)}
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Danh sách hóa đơn dịch vụ mới</Card.Title>
                                    <ul>
                                        {latestServiceBills.map((bill) => (
                                            <li key={bill.uid}>
                                                #{bill.uid} - {new Date(bill.created_at).toLocaleDateString()} - {formatCurrency(bill.total)}
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
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
                        {/* Tiến độ dự án
                        <Col xs={12} lg={8}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Tiến độ dự án</Card.Title>
                                    <ProgressBar now={60} label={`${60}%`} />
                                </Card.Body>
                            </Card>
                        </Col> */}
                    </Row>

                    <Row className="g-4 mt-4">
                        {/* Biểu đồ đường cho Sản phẩm */}
                        <Col xs={12} md={6}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Doanh thu sản phẩm</Card.Title>
                                    <div style={{ width: '100%', height: 'auto' }}>
                                        <LineChart style={{ width: '100%', height: 'auto' }} width={730} height={250} data={productData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis domain={[0, maxProductY]} />
                                            <YAxis />
                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                            <Legend />
                                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                        </LineChart>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Biểu đồ đường cho Dịch vụ */}
                        <Col xs={12} md={6}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Doanh thu dịch vụ</Card.Title>
                                    <div style={{ width: '100%', height: 'auto' }}>
                                        <LineChart style={{ width: '100%', height: 'auto' }} width={730} height={250} data={serviceData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis domain={[0, maxServiceY]} />
                                            <YAxis />
                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                            <Legend />
                                            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                                        </LineChart>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Biểu đồ tròn */}
                    </Row>
                </Container>
            </Layout>
        </>
    );
}

export default Home;
