import React, { useEffect, useRef, useState } from "react";
import { Link, router } from "@inertiajs/react";
import ModalComponent from "@/Components/ModalComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import { Sidebar, SubMenu, Menu, MenuItem, useProSidebar, sidebarClasses } from "react-pro-sidebar";
import { Badge, Col, Container, Form, Image, InputGroup, ListGroup, Navbar, Row, Spinner } from "react-bootstrap";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import SlideOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Swal from "sweetalert2";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import ProfileDropdown from "../Components/ProfileDropdown";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import { toast, ToastContainer } from "react-toastify";
import logo from "@img/logo-30glow.jpg";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

function Layout({ children }) {
    const [user, setUser] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const { collapseSidebar } = useProSidebar();
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
        const savedState = localStorage.getItem("isSidebarExpanded");
        if (savedState !== null) {
            setIsExpanded(JSON.parse(savedState));
            collapseSidebar(!JSON.parse(savedState));
        }
    }, [collapseSidebar]);

    const handleToggle = () => {
        if (!isExpanded) {
            collapseSidebar(false);
            setIsExpanded(true);
            localStorage.setItem("isSidebarExpanded", true);
        } else {
            collapseSidebar(true);
            setIsExpanded(false);
            localStorage.setItem("isSidebarExpanded", false);
        }
    };

    const [placeholderText, setPlaceholderText] = useState("");
    const fullText = "Bạn muốn tìm gì...?";
    const indexRef = useRef(0);
    const directionRef = useRef(1);
    const timeoutRef = useRef(null);

    useEffect(() => {
        function type() {
            if (directionRef.current === 1 && indexRef.current < fullText.length) {
                setPlaceholderText((prev) => prev + fullText.charAt(indexRef.current));
                indexRef.current++;
                if (indexRef.current === fullText.length) {
                    directionRef.current = -1;
                    timeoutRef.current = setTimeout(type, 1000);
                    return;
                }
            } else if (directionRef.current === -1 && indexRef.current > 0) {
                setPlaceholderText((prev) => prev.slice(0, -1));
                indexRef.current--;
                if (indexRef.current === 0) {
                    directionRef.current = 1;
                    timeoutRef.current = setTimeout(type, 1000);
                    return;
                }
            }
            timeoutRef.current = setTimeout(type, 100);
        }

        timeoutRef.current = setTimeout(type, 100);

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [fullText]);

    const handleLogout = () => {
        Swal.fire({
            title: "Đăng xuất tài khoản?",
            text: "Bạn có chắc muốn đăng xóa tài khoản này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                window.axios
                    .get("/auth/logout")
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res.data.message);
                            setTimeout(() => {
                                router.visit("/auth/login", {
                                    method: "get",
                                });
                            }, 2000);
                        }
                    })
                    .catch((err) => {
                        if (err.response && err.response.status === 401) {
                            toast.error(err.response.data.msg);
                        }
                    });
            }
        });
    };

    useEffect(() => {
        window.axios
            .get("/api/user/info")
            .then((response) => {
                if (response.data.check === true) {
                    setUser(response.data.data);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
            });
    }, []);

    return (
        <>
            {/* Alert notification */}
            <ToastContainer autoClose={2000} />
            {/* Alert notification */}

            <Container fluid id="app" className="p-0 my-0" style={({ height: "100vh" }, { display: "flex" })}>
                <Sidebar style={{ height: "100vh" }} collapsed={!isExpanded}>
                    <Menu>
                        <MenuItem icon={<MenuOutlinedIcon />} onClick={() => handleToggle()} style={{ textAlign: "center" }}>
                            <Image src={logo} />
                            {/* <h2> 30 Glow</h2> */}
                        </MenuItem>
                        <MenuItem icon={<HomeOutlinedIcon />} component={<Link href="/admin" method="get" as="a" />}>
                            Thống kê
                        </MenuItem>
                        <SubMenu icon={<PeopleOutlinedIcon />} label="Quản lý tài khoản">
                            <MenuItem icon={<BadgeOutlinedIcon />} component={<Link href="/admin/users" />}>
                                Ds nhân viên
                            </MenuItem>
                            <MenuItem icon={<PermContactCalendarOutlinedIcon />} component={<Link href="/admin/customers" />}>
                                Ds khách hàng
                            </MenuItem>
                            <MenuItem icon={<ManageAccountsOutlinedIcon />} component={<Link href="/admin/roles" />}>
                                Loại tài khoản
                            </MenuItem>
                            <MenuItem icon={<VerifiedUserOutlinedIcon />} component={<Link href="/admin/permissions" />}>
                                Quyền tài khoản
                            </MenuItem>
                        </SubMenu>
                        <SubMenu icon={<StorefrontIcon />} label="Quản lý Sản phẩm">
                            <MenuItem icon={<Inventory2OutlinedIcon />} component={<Link href="/admin/products" />}>
                                Ds sản phẩm
                            </MenuItem>
                            <MenuItem icon={<CategoryOutlinedIcon />} component={<Link href="/admin/categories" />}>
                                Danh mục
                            </MenuItem>
                            <MenuItem icon={<BrandingWatermarkOutlinedIcon />} component={<Link href="/admin/brands" />}>
                                Thương hiệu
                            </MenuItem>
                        </SubMenu>
                        <SubMenu icon={<ContentCutOutlinedIcon />} label="Quản lý dịch vụ">
                            <MenuItem icon={<ContentPasteOutlinedIcon />} component={<Link href="/admin/services" />}>
                                Ds dịch vụ
                            </MenuItem>
                            <MenuItem icon={<ClassOutlinedIcon />} component={<Link href="/admin/services/collections" />}>
                                Phân loại dịch vụ
                            </MenuItem>
                            <MenuItem icon={<CalendarMonthOutlinedIcon />} component={<Link href="/admin/bookings" />}>
                                Ds lịch đặt
                            </MenuItem>
                        </SubMenu>
                        <SubMenu icon={<ReceiptLongOutlinedIcon />} label="Quản lý bài viết">
                            <MenuItem icon={<StorefrontIcon />} component={<Link href="/admin/posts" />}>
                                Ds bài viết
                            </MenuItem>
                            <MenuItem icon={<StorefrontIcon />} component={<Link href="/admin/posts/collections" />}>
                                Chuyên mục bài viết
                            </MenuItem>
                        </SubMenu>
                        <SubMenu icon={<ReceiptLongOutlinedIcon />} label="Quản lý hóa đơn">
                            <MenuItem icon={<StorefrontIcon />} component={<Link href="/admin/bills" />}>
                                Hóa đơn sản phẩm
                            </MenuItem>
                            <MenuItem icon={<ContentPasteOutlinedIcon />} component={<Link href="/admin/bills-services" />}>
                                Hóa đơn dịch vụ
                            </MenuItem>
                        </SubMenu>
                        <MenuItem icon={<PermMediaOutlinedIcon />} component={<Link href="/admin/galleries" />}>
                            Bộ sưu tập
                        </MenuItem>
                        <MenuItem icon={<MapOutlinedIcon />} component={<Link href="/admin/sitemap" />}>
                            Sitemap
                        </MenuItem>
                        <MenuItem icon={<SlideOutlinedIcon />} component={<Link href="/admin/slides" />}>
                            Slides
                        </MenuItem>
                        <MenuItem icon={<ContactsOutlinedIcon />} component={<Link href="/admin/contacts" />}>
                            Contacts
                        </MenuItem>
                        <MenuItem icon={<HelpOutlineOutlinedIcon />}>FAQ</MenuItem>
                        <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem>
                    </Menu>
                </Sidebar>

                <Container fluid as={"main"} className="bg-body-light px-0">
                    {/* Thanh Header */}
                    <Navbar expand="lg" className="bg-body-tertiary">
                        <Container fluid>
                            <Navbar.Brand>
                                <Form inline>
                                    <InputGroup>
                                        <InputGroup.Text id="btn-search">
                                            <SearchIcon style={{ width: "20px", height: "20px" }} />
                                        </InputGroup.Text>
                                        <Form.Control placeholder={placeholderText} id="typing-text" aria-label="Username" aria-describedby="btn-search" />
                                    </InputGroup>
                                </Form>
                            </Navbar.Brand>

                            <Navbar.Collapse className="justify-content-center">
                                <Container fluid>
                                    <marquee direction="right" behavior="alternate" scrollamount="5">
                                        🌟 <span className="marquee-text">Mọi cố gắng sẽ được đền đáp</span> 🌟
                                    </marquee>
                                </Container>
                            </Navbar.Collapse>

                            <Navbar.Collapse className="justify-content-end">
                                <Navbar.Text>
                                    <span>Xin chào: </span>
                                    {!user && <Spinner animation="border" size="sm" className="me-1" />}
                                    <strong>{user ? user?.name : "Đang tải..."}</strong>
                                </Navbar.Text>
                                <ProfileDropdown event={handleLogout} show={handleShow} />
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>

                    {/* Thông tin cá nhân */}
                    <ModalComponent
                        show={show}
                        close={handleClose}
                        title={"Thông tin cá nhân"}
                        body={
                            <>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <strong>UID:</strong> {user?.uid}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Tên:</strong> {user?.name}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Email:</strong> {user?.email}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Điện thoại:</strong> {user?.phone || "Chưa cập nhật"}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Địa chỉ:</strong> {user?.address || "Chưa cập nhật"}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Trạng thái:</strong> {user?.status === 1 ? <Badge bg="success">Hoạt động</Badge> : <Badge bg="secondary">Tạm ngừng</Badge>}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Ngày tạo:</strong> {new Date(user?.created_at).toLocaleString()}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Ngày cập nhật:</strong> {new Date(user?.updated_at).toLocaleString()}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Vai trò:</strong>{" "}
                                        {user?.roles.map((role) => (
                                            <Badge bg="info" className="me-1" key={role.id}>
                                                {role.name}
                                            </Badge>
                                        ))}
                                    </ListGroup.Item>
                                </ListGroup>
                            </>
                        }
                        footer={
                            <>
                                <ButtonsComponent type="button" variant="secondary" icon="close" title="Thoát ra" onClick={handleClose} />
                            </>
                        }
                    />

                    {/* Nội dung chính */}
                    <Container fluid className="px-md-5 py-md-4 px-lg-5 py-lg-4 px-xl-5 py-xl-4">
                        {children}
                    </Container>
                </Container>
            </Container>
        </>
    );
}

export default Layout;
