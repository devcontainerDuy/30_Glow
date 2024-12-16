import React, { useEffect, useMemo, useState } from "react";
import Body from "@/Layouts/Body";
import { CheckCircle, Error } from "@mui/icons-material";
import { green, blue } from "@mui/material/colors";
import Layout from "@/Layouts/Index";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import ModalComponent from "@/Components/ModalComponent";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";
import useDelete from "@/Hooks/useDelete";
import useSubmitForm from "@/Hooks/useSubmitForm";

function Index({ contacts, crumbs, trashs }) {
    const [data, setData] = useState(contacts || []);
    const [trash, setTrash] = useState([]);
    const [show, setShow] = useState(false);
    const [id, setId] = useState(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [replyMessage, setReplyMessage] = useState("");
    const [note, setNote] = useState("");

    const handleClose = () => {
        setShow(false);
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
    };

    const handleShow = (id) => {
        const contact = data.find((contact) => contact.id === id);
        setId(contact.id);
        setName(contact.name);
        setPhone(contact.phone);
        setEmail(contact.email);
        setMessage(contact.message);
        setNote(contact.note);
        setShow(true);
        console.log(id);
        
    };

    const { handleSubmit, loading } = useSubmitForm("/admin/contacts", setData, setTrash, handleClose);
    const { handleDelete, handleRestore, handleDeleteForever, loading: loaded } = useDelete("/admin/contacts", setData, setTrash);
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     const requestData = {
    // name: name,
    // phone: phone,
    // email: email,
    // message: message,
    // replyMessage: replyMessage,
    //     };
    //     window.axios
    //         .post("/admin/contacts", requestData)
    //         .then((response) => {
    //             if (response.data.check === true) {
    //                 toast.success(response.data.message);
    //                 setData(response.data.data);
    //                 handleClose();
    //             } else {
    //                 toast.warning(response.data.message);
    //             }
    //         })
    //         .catch((error) => {
    //             toast.error(error.response.data.message);
    //         })
    //         .finally(() => setLoading(false));
    // };

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
                <div onClick={() => handleCellEditStop(params.row.id, "status", params.row.status === 1 ? 0 : 1)} style={{ cursor: "pointer" }}>
                    {params.row.status === 1 ? <CheckCircle style={{ color: green[500], marginRight: 8 }} /> : <Error style={{ color: blue[500], marginRight: 8 }} />}
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
                    <Button type="button" variant="outline-info" title="Xem chi tiết liên hệ" onClick={() => handleShow(params.row.id)}>
                        <i className="bi bi-envelope" />
                    </Button>
                    <Button className="ms-2" type="button" variant="outline-danger" title="Xóa liên hệ" onClick={() => handleDelete(params.row.id)}>
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);
    const columnsTrash = useMemo(() => [
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
                <div onClick={() => handleCellEditStop(params.row.id, "status", params.row.status === 1 ? 0 : 1)} style={{ cursor: "pointer" }}>
                    {params.row.status === 1 ? <CheckCircle style={{ color: green[500], marginRight: 8 }} /> : <Error style={{ color: blue[500], marginRight: 8 }} />}
                    <span>{params.row.status === 1 ? "Đã trả lời" : "Mới"}</span>
                </div>
            ),
        },

        {
            field: "deleted_at",
            headerName: "Ngày xóa",
            width: 200,
            valueGetter: (params) => formatCreatedAt(params),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <Button type="button" variant="outline-success" title="Khôi phục sản phẩm" onClick={() => handleRestore(params.row.id)}>
                        <i className="bi bi-arrow-clockwise" />
                    </Button>
                    <Button className="ms-2" type="button" variant="outline-danger" title="Xóa liên hệ" onClick={() => handleDelete(params.row.id)}>
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);
    const tabsData = useMemo(() => [
        {
            eventKey: "list",
            title: "Danh sách",
            data: data,
            columns: columns,
        },
        {
            eventKey: "trash",
            title: "Thùng rác",
            data: trash,
            columns: columnsTrash,
        },
    ]);
    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    console.log(data);

    useEffect(() => {
        const channel = pusher.subscribe("channelContacts");

        channel.bind("ContactsCreated", function (data) {
            setData(data.ContactsData);
        });
        setTrash(trashs);
    }, [trashs]);

    return (
        <>
            <Helmet>
                <title>Thông tin liên hệ</title>
                <meta name="description" content="Thông tin liên hệ" />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}></BreadcrumbComponent>
                        {/* Start Modal */}
                        <ModalComponent
                            show={show}
                            close={handleClose}
                            submit={(e) => {
                                e.preventDefault();
                                handleSubmit({ id: id, name: name, phone: phone, email: email, message: message, replyMessage: replyMessage });
                            }}
                            size="md"
                            title="Thêm mới"
                            loaded={loading}
                            body={
                                <>
                                    <Form>
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
                                                    <Form.Control
                                                        as="textarea"
                                                        value={note || replyMessage}
                                                        onChange={(e) => setReplyMessage(e.target.value)}
                                                        disabled={!!note}
                                                        placeholder={note ? "Đã có phản hồi" : "Nhập phản hồi..."}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Form>
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
