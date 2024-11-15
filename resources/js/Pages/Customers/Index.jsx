import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/Layouts/Index";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { Box, FormControl, FormControlLabel, MenuItem, Select, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Index({ customers, crumbs }) {
    const [data, setData] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleClose = () => {
        setShow(false);
        setName("");
        setEmail("");
    };
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        window.axios
            .post("/admin/customers", {
                name: name,
                email: email,
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
            window.axios
                .put("/admin/customers/" + id, {
                    [field]: value,
                })
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
            title: "Xóa tài khoản?",
            text: "Bạn chắc chắn xóa tài khoản này!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                window.axios
                    .delete("/admin/customers/" + id)
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res.data.message);
                            setData(res.data.data);
                        }
                    })
                    .catch((error) => {
                        toast.error(error.response.data.message);
                    });
            }
        });
    };

    const handleResetPassword = (id) => {
        window.axios
            .post("/admin/customers/" + id + "/reset-password")
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const columns = useMemo(() => [
        { field: "uid", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tên tài khoản",
            width: 200,
            editable: true,
        },
        {
            field: "email",
            headerName: "Địa chỉ mail",
            width: 200,
            editable: true,
            type: "email",
        },
        {
            field: "phone",
            headerName: "Số điện thoại",
            width: 200,
            editable: true,
            renderCell: (params) => {
                if (params.row.phone === null) {
                    return "Không có số điện thoại";
                }
                return (
                    <a href={"tel:" + params.row.phone} className="text-decoration-none">
                        {params.row.phone.toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
                    </a>
                );
            },
        },
        {
            field: "address",
            headerName: "Địa chỉ",
            width: 200,
            editable: true,
            renderCell: (params) => {
                if (params.row.address === null) {
                    return "Không có địa chỉ";
                }
                return params.row.address;
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 180,
            renderCell: (params) => {
                return (
                    <>
                        <FormControlLabel
                            control={<Switch checked={params.row.status === 1} onClick={() => handleCellEditStop(params.row.id, "status", params.row.status === 1 ? 0 : 1)} />}
                            label={params.row.status ? "Hoạt động" : "Ẩn"}
                        />
                    </>
                );
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => {
                return (
                    <>
                        <Button type="button" variant="outline-dark" title="Cập nhật lại mật khẩu" onClick={() => handleResetPassword(params.row.id)}>
                            <i className="bi bi-bootstrap-reboot" />
                        </Button>
                        <Button type="button" variant="outline-danger" className="ms-2" title="Xóa tài khoản" onClick={() => handleDelete(params.row.id)}>
                            <i className="bi bi-trash-fill" />
                        </Button>
                    </>
                );
            },
        },
    ]);

    useEffect(() => {
        setData(customers);
    }, [customers]);

    return (
        <>
            <Helmet>
                <title>Danh sách tài khoản khách hàng</title>
                <meta name="description" content="Danh sách tài khoản khách hàng" />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button type="button" variant="primary" onClick={handleShow}>
                                <i className="bi bi-person-fill-add" />
                                <span className="ms-2">Thêm tài khoản mới</span>
                            </Button>
                        </BreadcrumbComponent>

                        {/* Start Modal */}
                        <Modal show={show} onHide={handleClose}>
                            <Form onSubmit={handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        <span>Thêm tài khoản mới</span>
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group className="mb-3" controlId="name">
                                        <Form.Label>Nhập địa tên người dùng</Form.Label>
                                        <Form.Control type="text" placeholder="name abc" name="name" onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Nhập địa chỉ mail</Form.Label>
                                        <Form.Control type="email" placeholder="name@example.com" name="email" onChange={(e) => setEmail(e.target.value)} />
                                    </Form.Group>
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
                                                <span className="ms-2">
                                                    <span>Lưu lại</span>
                                                </span>
                                            </>
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                        {/* End Modal */}

                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách Tài Khoản Khách Hàng </h4>
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
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
