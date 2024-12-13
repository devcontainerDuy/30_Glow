import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/Layouts/Index";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { Box, FormControlLabel, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";

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
            .post("/admin/posts/collections", {
                name: name,
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
                .put("/admin/posts/collections/" + id, {
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
                    .delete("/admin/posts/collections/" + id)
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
                            control={<Switch checked={params.row.status === 1} onClick={() => handleCellEditStop(params.row.id, "status", params.row.status === 1 ? 0 : 1)} />}
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
                            control={<Switch checked={params.row.highlighted === 1} onClick={() => handleCellEditStop(params.row.id, "highlighted", params.row.highlighted === 1 ? 0 : 1)} />}
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
                        <Button type="button" variant="outline-danger" className="ms-2" title="Xóa tài khoản" onClick={() => handleDelete(params.row.id)}>
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
                <title>Danh sách chuyên đề bài viết</title>
                <meta name="description" content="Danh sách chuyên đề bài viết" />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <ButtonsComponent type="button" variant="primary" icon="add" title="Thêm mới" onClick={handleShow} />
                        </BreadcrumbComponent>
                        {/* Start Modal */}
                        <ModalComponent
                            show={show}
                            close={handleClose}
                            submit={handleSubmit}
                            size="md"
                            title="Thêm mới"
                            loaded={loading}
                            body={
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Loại dịch vụ</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên loại dịch vụ" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}
                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách chuyên đề bài viết </h4>
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
