import React, { useEffect, useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Sidebar, SubMenu, Menu, MenuItem, useProSidebar, sidebarClasses } from "react-pro-sidebar";
import { Container, Image, Navbar } from "react-bootstrap";
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

function Layout({ children }) {
    const [user, setUser] = useState(null);
    const { collapseSidebar } = useProSidebar();

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
        window.axios.get("/api/user").then((response) => {
            setUser(response.data);
        });
    }, []);

    return (
        <>
            {/* Alert notification */}
            <ToastContainer autoClose={2000} />
            {/* Alert notification */}

            <div id="app" style={({ height: "100vh" }, { display: "flex" })}>
                <Sidebar style={{ height: "100vh" }}>
                    <Menu>
                        <MenuItem icon={<MenuOutlinedIcon />} onClick={() => collapseSidebar()} style={{ textAlign: "center" }}>
                            {/* <Image src="./resources/img/logo-30glow.jpg" /> */}
                            <h2> 30 Glow</h2>
                        </MenuItem>
                        <MenuItem icon={<HomeOutlinedIcon />} component={<Link href="/admin/" method="get" as="a" />}>
                            Trang chủ
                        </MenuItem>
                        <SubMenu icon={<PeopleOutlinedIcon />} label="Quản lý tài khoản">
                            <MenuItem icon={<BadgeOutlinedIcon />} component={<Link href="/admin/users" />}>
                                Ds tài khoản
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
                                Danh mục sản phẩm
                            </MenuItem>
                            <MenuItem icon={<BrandingWatermarkOutlinedIcon />} component={<Link href="/admin/brands" />}>
                                Thương hiệu sản phẩm
                            </MenuItem>
                        </SubMenu>
                        <SubMenu icon={<ContentCutOutlinedIcon />} label="Quản lý dịch vụ">
                            <MenuItem icon={<ContentPasteOutlinedIcon />} component={<Link href="/admin/services" />}>
                                Ds dịch vụ
                            </MenuItem>
                            <MenuItem icon={<ClassOutlinedIcon />} component={<Link href="/admin/service-collections" />}>
                                Phân loại dịch vụ
                            </MenuItem>
                            <MenuItem icon={<CalendarMonthOutlinedIcon />} component={<Link href="/admin/bookings" />}>
                                Ds lịch đặt
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
                        <MenuItem icon={<ContactsOutlinedIcon />}>Contacts</MenuItem>
                        <MenuItem icon={<HelpOutlineOutlinedIcon />}>FAQ</MenuItem>
                        <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem>
                    </Menu>
                </Sidebar>

                <main className="w-100">
                    {/* Thanh Header */}
                    <Navbar expand="lg" className="bg-body-tertiary">
                        <Container fluid>
                            <Navbar.Brand href="#home">
                                <Image src="https://30shine.com/static/media/logo_30shine_new.7135aeb8.png" alt="30Shine" width="100" />
                            </Navbar.Brand>
                            <Navbar.Toggle />
                            <Navbar.Collapse className="justify-content-end">
                                <Navbar.Text>
                                    <span>Xin chào: </span>
                                    <strong>{user ? user?.name : "Đang tải..."}</strong>
                                </Navbar.Text>
                                <ProfileDropdown event={handleLogout} />
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    <Container fluid className="px-5 py-4">
                        {children}
                    </Container>
                </main>
            </div>
        </>
    );
}

export default Layout;
