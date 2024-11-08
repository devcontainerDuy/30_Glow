import React, { useEffect, useMemo, useState } from "react";
import { Box, FormControlLabel, Select, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { CheckCircle, Error } from "@mui/icons-material";
import { green, blue } from "@mui/material/colors";
import Layout from "@/Layouts/Index";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { FormControl, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import CKEditor from "@/Containers/CKEditor";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Index({ contacts, crumbs }) {
    const [data, setData] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [replyMessage, setReplyMessage] = useState("");

    const handleClose = () => {
        setShow(false);
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
    };

    const handleShow = (id) => {
        const contact = data.find((contact) => contact.id === id);
        setName(contact.name);
        setPhone(contact.phone);
        setEmail(contact.email);
        setMessage(contact.message);
        setShow(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const requestData = {
            name: name,
            phone: phone,
            email: email,
            message: message,
            replyMessage: replyMessage,
        };
        window.axios
            .post("/admin/contacts", requestData)
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
                    .delete("/admin/sitemap/" + id)
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
            headerName: "Tên người liên hệ",
            width: 180,
        },
        {
            field: "message",
            headerName: "Nội dung",
            width: 220,
        },
        {
            field: "email",
            headerName: "Email",
            width: 200,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 180,
            renderCell: (params) => (
                <div
                    onClick={() =>
                        handleCellEditStop(
                            params.row.id,
                            "status",
                            params.row.status === 1 ? 0 : 1
                        )
                    }
                    style={{ cursor: "pointer" }}
                >
                    {params.row.status === 1 ? (
                        <CheckCircle style={{ color: green[500], marginRight: 8 }} />
                    ) : (
                        <Error style={{ color: blue[500], marginRight: 8 }} />
                    )}
                    <span>{params.row.status === 1 ? "Đã trả lời" : "Mới"}</span>
                </div>
            ),
        },

        {
            field: "created_at",
            headerName: "Ngày gửi",
            width: 200,
            valueGetter: (params) => formatCreatedAt(params),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <Button
                        type="button"
                        variant="outline-info"
                        title="Xem chi tiết liên hệ"
                        onClick={() => handleShow(params.row.id)}
                    >
                        <i className="bi bi-envelope"/>
                    </Button>
                    <Button
                        className="ms-2"
                        type="button"
                        variant="outline-danger"
                        title="Xóa liên hệ"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);

    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const handleEditorBlur = (data) => {
        setReplyMessage(data);
    };
    useEffect(() => {
        setData(contacts);
    }, [contacts]);

    return (
        <>
            <Helmet>
                <title>Thông tin liên hệ</title>
                <meta name="description" content="Thông tin liên hệ" />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                        </BreadcrumbComponent>

                        {/* Start Modal */}
                        <Modal show={show} onHide={handleClose} size="lg">
                            <Form onSubmit={handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        Trả lời liên hệ của người dùng
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Tên người liên hệ</Form.Label>
                                                <Form.Control type="text" value={name} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="row-cols-2">
                                        <Col>
                                            <Form.Group className="mb-3" controlId="email">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" value={email} disabled />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="phone">
                                                <Form.Label>Số điện thoại</Form.Label>
                                                <Form.Control type="text" value={phone} disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="message">
                                                <Form.Label>Nội dung</Form.Label>
                                                <Form.Control as="textarea" value={message} disabled />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Trả lời người dùng</Form.Label>
                                                <Form.Control as="textarea" value={replyMessage} required onChange={(e) => setReplyMessage(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Đóng
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            "Gửi"
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
                                    <h4>Thông tin liên hệ</h4>
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
