import React from "react";
import Layout from "../Layouts/Index";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    ListGroup,
    ProgressBar,
    Row,
} from "react-bootstrap";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";

function Home() {
    const data = [
        { name: "Jan", value: 10000 },
        { name: "Feb", value: 15000 },
        // ... thêm dữ liệu cho biểu đồ
    ];

    const pieData = [
        { name: "Direct", value: 40 },
        { name: "Social", value: 30 },
        { name: "Referral", value: 30 },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
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
                    <Row className="g-4">
                        {/* Thẻ tổng quan */}
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Tổng số người dùng</Card.Title>
                                    <Card.Text className="h3">
                                        1500 <Badge bg="secondary">+30</Badge>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Doanh thu tháng này</Card.Title>
                                    <Card.Text className="h3">
                                        $12,500
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Đơn hàng mới</Card.Title>
                                    <Card.Text className="h3">50</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Sản phẩm bán chạy</Card.Title>
                                    <Card.Text>Laptop ABC</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Bảng dữ liệu */}
                        <Col xs={12} md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        Danh sách đơn hàng mới
                                    </Card.Title>
                                    {/* Thay thế bằng component bảng dữ liệu thực tế */}
                                    <ul>
                                        <li>Đơn hàng #123</li>
                                        <li>Đơn hàng #456</li>
                                        <li>Đơn hàng #789</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Hoạt động gần đây */}
                        <Col xs={12} md={4}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Hoạt động gần đây</Card.Title>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            Người dùng mới đăng ký{" "}
                                            <Badge bg="success">Mới</Badge>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Đơn hàng #123 đã được thanh toán
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Tiến độ dự án */}
                        <Col xs={12} lg={8}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Tiến độ dự án</Card.Title>
                                    <ProgressBar now={60} label={`${60}%`} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="g-4 mt-4">
                        {/* Biểu đồ */}
                        <Col xs={12} md={8}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Biểu đồ doanh thu</Card.Title>
                                    {/* Thay thế bằng component biểu đồ thực tế */}
                                    <div>Biểu đồ doanh thu</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* 4 thẻ tổng quan */}
                        <Col xs={12} sm={6} md={3}>
                            <Card className="shadow-sm border-left-primary">
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <Card.Text className="text-uppercase text-muted mb-1">
                                                Earnings (Monthly)
                                            </Card.Text>
                                            <Card.Title className="h5 mb-0">
                                                $40,000
                                            </Card.Title>
                                        </Col>
                                        <Col className="col-auto">
                                            <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Biểu đồ đường */}
                        <Col xs={12} md={8}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Earnings Overview</Card.Title>
                                    <LineChart
                                        width={730}
                                        height={250}
                                        data={data}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#8884d8"
                                        />
                                    </LineChart>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Biểu đồ tròn */}
                        <Col xs={12} md={4}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Revenue Sources</Card.Title>
                                    <PieChart width={300} height={250}>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
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
