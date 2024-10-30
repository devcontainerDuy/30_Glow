import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/Layouts/Index";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { Box, FormControlLabel, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";

function Index({ collections, crumbs }) {
    const [data, setData] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");

    const handleClose = () => {
        setShow(false);
        setName("");
    };
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        window.axios
            .post("/admin/service-collections", {
                name: name,
            })
            .then((res) => {
                if (res.data.check == true) {
                    window.notyf.open({
                        type: "success",
                        message: res.data.msg,
                    });
                    setData(res.data.data);
                    handleClose();
                } else {
                    window.notyf.open({
                        type: "error",
                        message: res.data.msg,
                    });
                }
            })
            .catch((error) => {
                window.notyf.open({
                    type: "error",
                    message: error.response.data.msg,
                });
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
                .put("/admin/service-collections/" + id, {
                    [field]: value,
                })
                .then((res) => {
                    if (res.data.check == true) {
                        window.notyf.open({
                            type: "success",
                            message: res.data.msg,
                        });
                        setData(res.data.data);
                    }
                })
                .catch((error) => {
                    window.notyf.open({
                        type: "error",
                        message: error.response.data.msg,
                    });
                });
        } else {
            setEditingCells((prev) => {
                const newEditingCells = { ...prev };
                delete newEditingCells[id + "-" + field];
                return newEditingCells;
            });
            window.notyf.open({
                type: "warning",
                message: "Không chỉnh sửa.",
            });
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
                    .delete("/admin/service-collections/" + id)
                    .then((res) => {
                        if (res.data.check == true) {
                            window.notyf.open({
                                type: "success",
                                message: res.data.msg,
                            });
                            setData(res.data.data);
                        }
                    })
                    .catch((error) => {
                        window.notyf.open({
                            type: "error",
                            message: error.response.data.msg,
                        });
                    });
            }
        });
    };

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tên loại dịch vụ",
            width: 200,
            editable: true,
        },
        {
            field: "slug",
            headerName: "Slug",
            width: 200,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={params.row.status === 1}
                                    onClick={() =>
                                        handleCellEditStop(
                                            params.row.id,
                                            "status",
                                            params.row.status === 1 ? 0 : 1
                                        )
                                    }
                                />
                            }
                            label={params.row.status ? "Hoạt động" : "Ẩn"}
                        />
                    </>
                );
            },
        },
        {
            field: "highlighted",
            headerName: "Nổi bật",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={params.row.highlighted === 1}
                                    onClick={() =>
                                        handleCellEditStop(
                                            params.row.id,
                                            "highlighted",
                                            params.row.highlighted === 1 ? 0 : 1
                                        )
                                    }
                                />
                            }
                            label={params.row.highlighted ? "Nổi bật" : "Ẩn"}
                        />
                    </>
                );
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 180,
            renderCell: (params) => {
                return new Date(params.row.created_at).toLocaleString();
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => {
                return (
                    <>
                        <Button
                            type="button"
                            variant="outline-danger"
                            className="ms-2"
                            title="Xóa tài khoản"
                            onClick={() => handleDelete(params.row.id)}
                        >
                            <i className="bi bi-trash-fill" />
                        </Button>
                    </>
                );
            },
        },
    ]);

    useEffect(() => {
        setData(collections);
    }, [collections]);
    return (
        <>
            <Helmet>
                <title>Danh sách phân loại dịch vụ</title>
                <meta
                    name="description"
                    content="Danh sách phân loại dịch vụ"
                />
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
                                    Thêm phân loại dịch vụ mới
                                </span>
                            </Button>
                        </BreadcrumbComponent>
                        {/* Start Modal */}
                        <Modal show={show} onHide={handleClose}>
                            <Form onSubmit={handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        <span>Thêm phân loại dịch vụ mới</span>
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="name"
                                    >
                                        <Form.Label>
                                            Nhập địa tên phân loại
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="name abc"
                                            name="name"
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={handleClose}
                                    >
                                        <i className="bi bi-box-arrow-right" />
                                        <span className="ms-2">Thoát ra</span>
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
                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách Phân Loại Dịch Vụ </h4>
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
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
