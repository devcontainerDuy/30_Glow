import React, { useState, useEffect, useMemo } from "react";
import Layout from "@layouts/Index";
import Body from "@/Layouts/Body";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { Box, FormControl, FormControlLabel, MenuItem, Select, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Index({ users, role, crumbs }) {
    const [data, setData] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [idRole, setIdRole] = useState("");

    const handleClose = () => {
        setShow(false);
        setName("");
        setEmail("");
        setIdRole("");
    };
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        window.axios
            .post("/admin/users", {
                name: name,
                email: email,
                roles: idRole,
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
                .put("/admin/users/" + id, {
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
                    .delete("/admin/users/" + id)
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
            field: "roles",
            headerName: "Loại tài khoản",
            width: 200,
            renderCell: (params) => {
                let roleId = params.row.roles[0]?.name || "";
                console.log(roleId);

                return (
                    <>
                        <FormControl fullWidth>
                            <Select
                                id="simple-select"
                                value={roleId}
                                displayEmpty
                                onChange={(e) => {
                                    handleCellEditStop(params.row.id, "roles", e.target.value);
                                }}
                            >
                                <MenuItem value="">Chưa phân quyền</MenuItem>
                                {rolesData.map((item, index) => (
                                    <MenuItem key={index} value={item.name}>
                                        {item.name || "Lỗi"}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                );
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
            field: "created_at",
            headerName: "Ngày tạo",
            width: 200,
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
                        <Button type="button" variant="outline-dark" title="Cập nhật lại mật khẩu">
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
        setData(users);
        setRolesData(role);
    }, [users]);

    return (
        <>
            <Helmet>
                <title>Danh sách tài khoản</title>
                <meta name="description" content="Danh sách tài khoản" />
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
                                    <Form.Group className="mb-3" controlId="name">
                                        <Form.Label>Nhập tên người dùng</Form.Label>
                                        <Form.Control type="text" placeholder="name abc" name="name" onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Nhập địa chỉ mail</Form.Label>
                                        <Form.Control type="email" placeholder="name@example.com" name="email" onChange={(e) => setEmail(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Chọn loại tài khoản</Form.Label>
                                        <Form.Select aria-label="Loại tài khoản" name="role" onChange={(e) => setIdRole(e.target.value)}>
                                            <option value="">-- Chọn --</option>
                                            {rolesData.length > 0 &&
                                                rolesData.map((item, index) => (
                                                    <option key={index} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}

                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách Tài Khoản </h4>
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
