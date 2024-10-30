import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/Layouts/Index";
import { Row, Col, Button, Modal, Form, Spinner } from "react-bootstrap";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";

import Swal from "sweetalert2";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Index({ permissions, crumbs }) {
    const [data, setData] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [guardName, setGuardName] = useState("");

    const handleClose = () => {
        setShowModal(false);
        setName("");
        setGuardName("");
    };
    const handleShow = () => setShowModal(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        window.axios
            .post("/admin/permissions", {
                name: name,
                guard_name: guardName,
            })
            .then((response) => {
                if (response.data.check === true) {
                    toast.success(response.data.message);
                    setData(response.data.data);
                    handleClose();
                } else {
                    toast.warning(response.data.message);
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
                .put("/admin/permissions/" + id, {
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
            title: "Xóa mục?",
            text: "Bạn chắc chắn muốn xóa mục này!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                window.axios
                    .delete("/admin/permissions/" + id)
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
            headerName: "Tên loại tài khoản",
            width: 250,
            editable: true,
        },
        {
            field: "guard_name",
            headerName: "Quyền truy cập",
            width: 250,
            editable: true,
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 220,
            renderCell: (params) => {
                return new Date(params.row.created_at).toLocaleString();
            },
        },
        {
            field: "updated_at",
            headerName: "Ngày thay đổi",
            width: 220,
            renderCell: (params) => {
                return new Date(params.row.updated_at).toLocaleString();
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 180,
            renderCell: (params) => (
                <>
                    <Button
                        type="button"
                        variant="outline-danger"
                        className="ms-2"
                        title="Xóa loại tài khoản"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);

    useEffect(() => {
        setData(permissions);
    }, [permissions]);

    return (
        <>
            <Helmet>
                <title>Danh sách quyền </title>
                <meta name="description" content="Danh sách quyền " />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleShow}
                            >
                                <i className="bi bi-plus-lg" />
                                <span className="ms-2">
                                    Thêm quyền tài khoản mới
                                </span>
                            </Button>
                        </BreadcrumbComponent>
                        {/* Start Modal */}
                        <Modal show={showModal} onHide={handleClose}>
                            <Form onSubmit={handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        Thêm quyền tài khoản mới
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formBasic"
                                    >
                                        <Form.Label>
                                            Tên quyền tài khoản
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên quyền tài khoản"
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formBasic"
                                    >
                                        <Form.Label>Quyền truy cập</Form.Label>
                                        <Form.Select
                                            aria-label="Default select example"
                                            onChange={(e) =>
                                                setGuardName(e.target.value)
                                            }
                                        >
                                            <option value="">-- Chọn --</option>
                                            <option value="web">Web</option>
                                            <option value="api">API</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={handleClose}
                                    >
                                        <i className="bi bi-box-arrow-right" />
                                        <span className="ms-2">Thoát ra</span>
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    size="sm"
                                                    animation="border"
                                                    variant="secondary"
                                                />
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
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách Quyền </h4>
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
                                        handleCellEditStop(
                                            params.row.id,
                                            params.field,
                                            e.target.value
                                        );
                                    }}
                                    onCellEditStart={(params, e) => {
                                        handleCellEditStart(
                                            params.row.id,
                                            params.field,
                                            e.target.value
                                        );
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
