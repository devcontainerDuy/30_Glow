import React, { useState, useEffect, useMemo } from "react";
import Layout from "@layouts/Index";
import Body from "@/Layouts/Body";
import { Form, Row } from "react-bootstrap";
import { FormControl, FormControlLabel, MenuItem, Select, Switch } from "@mui/material";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import { Helmet } from "react-helmet";
import useSubmitForm from "@/hooks/useSubmitForm";
import useEditCell from "@/hooks/useEditCell";
import useDelete from "@/hooks/useDelete";

function Index({ users, trashs, role, crumbs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    const [rolesData, setRolesData] = useState([]);
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

    const { handleSubmit, loading } = useSubmitForm("/admin/users", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/users");
    const { handleDelete, handleRestore, handleDeleteForever, loading: loaded } = useDelete("/admin/users", setData, setTrash);

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
                        <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDelete(params.row.id)} />
                    </>
                );
            },
        },
    ]);

    const columnsTrash = useMemo(() => [
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

                return (
                    <>
                        <FormControl fullWidth>
                            <Select id="simple-select" value={roleId} displayEmpty disabled>
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
                        <FormControlLabel control={<Switch checked={params.row.status === 1} disabled />} label={params.row.status ? "Hoạt động" : "Ẩn"} />
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
                        <div className="d-flex gap-2 align-items-center mt-2">
                            <ButtonsComponent type="button" variant="outline-success" icon="reset" onClick={() => handleRestore(params.row.id)} />
                            <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDeleteForever(params.row.id)} />
                        </div>
                    </>
                );
            },
        },
    ]);

    const tabsData = [
        {
            eventKey: "list",
            title: "Danh sách",
            data: data,
            columns: columns,
            handleCellEditStop: handleCellEditStop,
            handleCellEditStart: handleCellEditStart,
        },
        {
            eventKey: "trash",
            title: "Thùng rác",
            data: trash,
            columns: columnsTrash,
            handleCellEditStop: handleCellEditStop,
            handleCellEditStart: handleCellEditStart,
        },
    ];

    useEffect(() => {
        setData(users);
        setTrash(trashs);
        setRolesData(role);
    }, [users, trashs, role]);

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
                            submit={(e) => {
                                e.preventDefault();
                                handleSubmit({ name, email, roles: idRole });
                            }}
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
                        <Body title="Danh sách tài khoản" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
