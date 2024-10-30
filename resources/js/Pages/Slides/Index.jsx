import React, { useEffect, useMemo, useState } from "react";
import { Box, FormControlLabel, Select, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Layout from "@/Layouts/Index";

import { Row, Col, Button, Modal, Form, Spinner, Image } from "react-bootstrap";
import Swal from "sweetalert2";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Index({ slides, crumbs }) {
    const [data, setData] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState(""); // Tiêu đề slide
    const [files, setFiles] = useState([]);
    const [desktop, setDesktop] = useState([]);
    const [mobile, setMobile] = useState([]);
    const [status, setStatus] = useState(1);

    const handleClose = () => {
        setShowModal(false);
        setName("");
        setDesktop([]);
        setMobile([]);
        setStatus(0);
    };

    const handleShow = () => setShowModal(true);

    const updateFiles = (files, type) => {
        if (type === "desktop") {
            setDesktop(files);
        } else if (type === "mobile") {
            setMobile(files);
        }
    };

    const onDelete = (file, type) => {
        if (type === "desktop") {
            setDesktop(desktop.filter((f) => f !== file));
        } else if (type === "mobile") {
            setMobile(mobile.filter((f) => f !== file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("status", 1);

        // Thêm các file desktop vào dưới dạng mảng
        desktop.forEach((file) => {
            formData.append("desktop[]", file.file); // hoặc file, tùy theo cấu trúc dữ liệu
        });

        // Thêm các file mobile vào dưới dạng mảng
        mobile.forEach((file) => {
            formData.append("mobile[]", file.file);
        });

        window.axios
            .post("/admin/slides", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res.data.message);
                    setData(res.data.data);
                    handleClose();
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            })
            .finally(() => setLoading(false));
    };
    const handleCellEditStart = (id, field, value) => {
        setEditingCells((prev) => ({ ...prev, [id + "-" + field]: value }));
    };

    const handleCellEditStop = (id, field, value) => {
        const originalValue = editingCells[id + "-" + field];

        if (originalValue !== value) {
            console.log("Updating status for ID:", id, "to:", value);

            window.axios
                .put(`/admin/slides/${id}`, { [field]: value })
                .then((res) => {
                    if (res.data.check === true) {
                        toast.success(res.data.message);
                        setData(res.data.data); // Cập nhật dữ liệu
                    } else {
                        toast.warning(res.data.message);
                    }
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                });
        } else {
            setEditingCells((prev) => {
                const newEditingCells = { ...prev };
                delete newEditingCells[id + "-" + field];
                return newEditingCells;
            });
            toast.info("Không có chỉnh sửa.");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Xóa slide?",
            text: "Bạn chắc chắn xóa slide!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                window.axios
                    .delete("/admin/slides/" + id)
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res.data.message);
                            setData(res.data.data);
                        } else {
                            toast.warning(res.data.message);
                        }
                    })
                    .catch((error) => {
                        toast.error(error.response.data.message);
                    });
            }
        });
    };

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tên",
            width: 180,
            editable: true,
        },
        {
            field: "slug",
            headerName: "Slug",
            width: 140,
        },
        {
            field: "url",
            headerName: "URL",
            width: 160,
        },
        {
            field: "desktop",
            headerName: "Hình ảnh Desktop",
            width: 160,
            renderCell: (params) => {
                const imageUrl = params.value ? "/storage/slides/desktop/" + params.value : "";
                return (
                    <>
                        <Image fluid className="rounded-1 h-100 p-0 m-0" src={imageUrl} alt={params.value || "No Image"} />
                    </>
                );
            },
        },
        {
            field: "mobile",
            headerName: "Hình ảnh Mobile",
            width: 160,
            renderCell: (params) => {
                const imageUrl = params.value ? "/storage/slides/mobile/" + params.value : "";
                return (
                    <>
                        <Image fluid className="rounded-1 h-100 p-0 m-0" src={imageUrl} alt={params.value || "No Image"} />
                    </>
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 180,
            renderCell: (params) => (
                <>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={params.row.status === 1}
                                onChange={() => {
                                    const newStatus = params.row.status === 1 ? 0 : 1; // Lấy trạng thái mới
                                    handleCellEditStop(params.row.id, "status", newStatus); // Gửi dữ liệu đi
                                }}
                            />
                        }
                        label={params.row.status ? "Hoạt động" : "Ẩn"}
                    />
                </>
            ),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <Button type="button" variant="outline-info" title="Xem chi tiết slide">
                        <i className="bi bi-exclamation-circle" />
                    </Button>
                    <Button className="ms-2" type="button" variant="outline-danger" title="Xóa slide" onClick={() => handleDelete(params.row.id)}>
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);

    useEffect(() => {
        setData(slides);
    }, [slides]);

    return (
        <>
            <Helmet>
                <title>Sitemap </title>
                <meta name="description" content="Sitemap " />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button type="button" variant="primary" onClick={handleShow}>
                                <i className="bi bi-plus-lg" />
                                <span className="ms-2">Thêm Sitemap Mới</span>
                            </Button>
                        </BreadcrumbComponent>
                        {/* Start Modal */}
                        <Modal show={showModal} onHide={handleClose} size="lg" centered>
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        <span>Thêm Slide Mới</span>
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="overflow-auto" style={{ maxHeight: "calc(100vh - 210px)" }}>
                                    <Row className="row-cols-1">
                                        <Col className="d-flex flex-column">
                                            {/* Tiêu đề slide */}
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Nhập Tiêu Đề Slide</Form.Label>
                                                <Form.Control type="text" placeholder="Tiêu đề slide..." name="name" required onChange={(e) => setName(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="row-cols-1 row-cols-md-2">
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasic">
                                                <Form.Label>Hình ảnh Desktop</Form.Label>
                                                <Dropzone onChange={(files) => updateFiles(files, "desktop")} className="mb-3" accept="chỉ nhận file (.jpeg, .png, .jpg, .gif)" value={desktop}>
                                                    {desktop &&
                                                        desktop.length > 0 &&
                                                        desktop.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={() => onDelete(file, "desktop")} />)}
                                                </Dropzone>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="formBasic">
                                                <Form.Label>Hình ảnh Mobile</Form.Label>
                                                <Dropzone onChange={(files) => updateFiles(files, "mobile")} className="mb-3" accept="chỉ nhận file (.jpeg, .png, .jpg, .gif)" value={mobile}>
                                                    {mobile &&
                                                        mobile.length > 0 &&
                                                        mobile.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={() => onDelete(file, "mobile")} />)}
                                                </Dropzone>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        <i className="bi bi-box-arrow-right" />
                                        <span className="ms-2">Thoát ra</span>
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Spinner size="sm" animation="border" variant="secondary" />
                                                <span>Đang lưu...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-floppy-fill" />
                                                <span className="ms-2">Lưu lại</span>
                                            </>
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                        {/* End Modal */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Sitemap</h4>
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
                                    onCellEditStop={(params, e) => {
                                        handleCellEditStop(params.row.id, params.field, e.target.value);
                                    }}
                                    onCellEditStart={(params, e) => {
                                        handleCellEditStart(params.row.id, params.field, e.target.value);
                                    }}
                                    pageSizeOptions={[20, 40, 60, 80, 100]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </Col>
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
