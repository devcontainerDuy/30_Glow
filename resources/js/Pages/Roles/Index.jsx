import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/Layouts/Index";
import { Button, Card, Col, Form, Modal, Row, Spinner } from "react-bootstrap";

import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";

function Index({ roles, permissions, crumbs }) {
    const [data, setData] = useState([]);
    const [permissionData, setPermissionData] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [name, setName] = useState("");
    const [guardName, setGuardName] = useState("");
    const [editingId, setEditingId] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const handleClose = () => {
        setShowModal(false);
        setName("");
        setGuardName("");
    };
    const handleShow = () => setShowModal(true);

    const handleCloseDetail = () => {
        setShowDetail(false);
        setEditingId({});
        setSelectedPermissions([]);
    };
    const handleShowDetail = (id) => {
        setShowDetail(true);
        window.axios
            .get("/admin/roles/" + id)
            .then((res) => {
                if (res.data.check === true) {
                    setEditingId(res.data.data);
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
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        window.axios
            .post("/admin/roles", {
                name: name,
                guard_name: guardName,
            })
            .then((response) => {
                if (response.data.check === true) {
                    window.notyf.open({
                        type: "success",
                        message: response.data.msg,
                    });
                    setData(response.data.data);
                    handleClose();
                } else {
                    window.notyf.open({
                        type: "error",
                        message: response.data.msg,
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
                .put("/admin/roles/" + id, {
                    [field]: value,
                })
                .then((res) => {
                    if (res.data.check === true) {
                        window.notyf.open({
                            type: "success",
                            message: res.data.msg,
                        });
                        setData(res.data.data);
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

    const handleUpdate = (id, e) => {
        e.preventDefault();
        window.axios
            .post("/admin/handleRole/permission/" + id, {
                permissions: selectedPermissions,
            })
            .then((res) => {
                if (res.data.check === true) {
                    window.notyf.open({
                        type: "success",
                        message: res.data.msg,
                    });
                    setData(res.data.data);
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
            });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Xóa loại tài khoản?",
            text: "Bạn chắc chắn xóa loại tài khoản này!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                window.axios
                    .delete("/admin/roles/" + id)
                    .then((res) => {
                        if (res.data.check == true) {
                            window.notyf.open({
                                type: "success",
                                message: res.data.msg,
                            });
                            setData(res.data.data);
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
                    });
            }
        });
    };

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tên loại tài khoản",
            width: 200,
            editable: true,
        },
        {
            field: "guard_name",
            headerName: "Quyền truy cập",
            width: 200,
            editable: true,
            type: "singleSelect",
            valueOptions: ["web", "api"],
        },
        {
            field: "permissions",
            headerName: "Quyền truy cập",
            width: 380,
            renderCell: (params) => {
                if (
                    params.row.permissions &&
                    params.row.permissions.length > 0
                ) {
                    return params.row.permissions.map((permission, index) => (
                        <span key={index}>
                            {permission.name}
                            {index < params.row.permissions.length - 1
                                ? ", "
                                : ""}
                        </span>
                    ));
                } else {
                    return "Không có";
                }
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 200,
            renderCell: (params) => {
                return new Date(params.row.created_at).toLocaleString();
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <Button
                        type="button"
                        variant="outline-info"
                        title="Xem và sửa loại tài khoản"
                        onClick={() => handleShowDetail(params.row.id)}
                    >
                        <i className="bi bi-exclamation-circle" />
                    </Button>
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
        setData(roles);
        setPermissionData(permissions);
        if (editingId?.permissions) {
            setSelectedPermissions(
                editingId.permissions.map((item) => ({
                    value: item.id,
                    label: item.name,
                }))
            );
        }
    }, [roles, permissions, editingId]);

    return (
        <>
            <Layout>
                <Helmet>
                    <title>Danh sách vai trò</title>
                    <meta name="description" content="Danh sách vai trò" />
                </Helmet>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleShow}
                            >
                                <i className="bi bi-plus-lg" />
                                <span className="ms-2">Thêm vai trò mới</span>
                            </Button>
                        </BreadcrumbComponent>

                        {/* Start Modal */}
                        <Modal show={showModal} onHide={handleClose}>
                            <Form onSubmit={handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Thêm vai trò mới</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formBasic"
                                    >
                                        <Form.Label>Tên vai trò</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên vai trò"
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

                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách Vai Trò </h4>
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
                        <Col xs="12" hidden={showDetail === false}>
                            {editingId !== null && (
                                <>
                                    <Card className="border border-dark rounded-2">
                                        <Form
                                            className="p-4"
                                            onSubmit={(e) =>
                                                handleUpdate(editingId.id, e)
                                            }
                                        >
                                            <h2>
                                                Thông tin & thao tác loại tài
                                                khoản
                                            </h2>
                                            <hr className="mb-4" />
                                            <Form.Group
                                                className="mb-3"
                                                controlId="formBasic1"
                                            >
                                                <Form.Label>
                                                    Tên loại tài khoản
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên loại tài khoản"
                                                    defaultValue={
                                                        editingId.name
                                                    }
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="formBasic5"
                                            >
                                                <Form.Label>
                                                    Quyền truy cập
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập quyền truy cập"
                                                    defaultValue={
                                                        editingId.guard_name
                                                    }
                                                    disabled
                                                />
                                            </Form.Group>
                                            <div className="d-flex column-gap-2 justify-content-between">
                                                <Form.Group
                                                    className="mb-3 w-50"
                                                    controlId="formBasic2"
                                                >
                                                    <Form.Label>
                                                        Ngày tạo
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={new Date(
                                                            editingId.created_at
                                                        ).toLocaleString()}
                                                        disabled
                                                    />
                                                </Form.Group>
                                                <Form.Group
                                                    className="mb-3 w-50"
                                                    controlId="formBasic3"
                                                >
                                                    <Form.Label>
                                                        Ngày cập nhật
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={new Date(
                                                            editingId.updated_at
                                                        ).toLocaleString()}
                                                        disabled
                                                    />
                                                </Form.Group>
                                            </div>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="formBasic4"
                                            >
                                                <Form.Label>
                                                    Các quyền của loại tài khoản
                                                </Form.Label>
                                                {/* Start Select2 */}
                                                <AsyncSelect
                                                    name="permissions"
                                                    cacheOptions={true}
                                                    closeMenuOnSelect={false}
                                                    components={makeAnimated()}
                                                    isMulti
                                                    value={selectedPermissions}
                                                    defaultOptions={permissionData.map(
                                                        (perm) => ({
                                                            value: perm.id,
                                                            label: perm.name,
                                                        })
                                                    )}
                                                    onChange={(newValue) => {
                                                        setSelectedPermissions(
                                                            newValue
                                                        );
                                                        console.log(newValue);
                                                    }}
                                                    placeholder="Chọn quyền"
                                                    noOptionsMessage={() => {
                                                        return "Không có quyền";
                                                    }}
                                                />
                                                {/* End Select2 */}
                                            </Form.Group>

                                            <div className="d-flex column-gap-2">
                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                >
                                                    <i className="bi bi-trash-fill" />
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="w-100"
                                                    onClick={handleCloseDetail}
                                                >
                                                    <i className="bi bi-x-circle" />
                                                    <span className="ms-2">
                                                        Hủy chỉnh sửa
                                                    </span>
                                                </Button>

                                                <Button
                                                    type="submit"
                                                    variant="success"
                                                    className="w-100"
                                                >
                                                    <i className="bi bi-floppy" />
                                                    <span className="ms-2">
                                                        Lưu lại chỉnh sửa này
                                                    </span>
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card>
                                </>
                            )}
                        </Col>
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
