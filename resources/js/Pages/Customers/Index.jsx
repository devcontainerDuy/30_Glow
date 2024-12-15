import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { Box, FormControl, FormControlLabel, MenuItem, Select, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";
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

    const { handleSubmit, loading: loaded } = useSubmitForm("/admin/customers", setData, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/customers", setData);
    const { handleDelete } = useDelete("/admin/customers", setData);

    const handleResetPassword = (id) => {
        setLoading(true);
        window.axios
            .post("/admin/customers/" + id + "/reset-password")
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            })
            .finally(() => setLoading(false));
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
                        <div className="d-flex gap-2 align-items-center mt-2">
                            <ButtonsComponent type="button" variant="outline-dark" icon="reset" onClick={() => handleResetPassword(params.row.id)} />
                            <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDelete(params.row.id)} />
                        </div>
                    </>
                );
            },
        },
    ]);

    const tabsData = useMemo(() => [
        {
            eventKey: "roles",
            title: "Danh sách",
            data: data,
            columns: columns,
            handleCellEditStop: handleCellEditStop,
            handleCellEditStart: handleCellEditStart,
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
                            <ButtonsComponent type="button" variant="primary" icon="add" title="Thêm mới" onClick={handleShow} />
                        </BreadcrumbComponent>

                        {/* Start Modal */}
                        <ModalComponent
                            show={show}
                            close={handleClose}
                            size="md"
                            submit={(e) => {
                                e.preventDefault();
                                handleSubmit({ name: name, email: email });
                            }}
                            title="Thêm mới"
                            loaded={loaded}
                            body={
                                <>
                                    <Form.Group className="mb-3" controlId="name">
                                        <Form.Label>Nhập địa tên người dùng</Form.Label>
                                        <Form.Control type="text" placeholder="name abc" name="name" onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Nhập địa chỉ mail</Form.Label>
                                        <Form.Control type="email" placeholder="name@example.com" name="email" onChange={(e) => setEmail(e.target.value)} />
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}

                        {/* Start DataGrid */}
                        <Body title="Danh sách khách hàng" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
