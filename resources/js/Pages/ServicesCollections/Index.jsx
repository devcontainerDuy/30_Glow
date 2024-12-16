import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { Box, FormControlLabel, Switch } from "@mui/material";
import { Helmet } from "react-helmet";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";

function Index({ collections, crumbs, trashs }) {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [trash, setTrash] = useState([]);

    const handleClose = () => {
        setShow(false);
        setName("");
    };
    const handleShow = () => setShow(true);
    const { handleSubmit, loading } = useSubmitForm("/admin/services/collections", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/services/collections", setData);
    const { handleDelete, handleRestore, handleDeleteForever, loading: loaded } = useDelete("/admin/services/collections", setData, setTrash);

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
    const columnsTrash = useMemo(() => [
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
            field: "deleted_at",
            headerName: "Ngày xóa",
            width: 220,
            renderCell: (params) => {
                return new Date(params.row.deleted_at).toLocaleString();
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => {
                return (
                    <>
                        <Button type="button" variant="outline-success" title="Khôi phục sản phẩm" onClick={() => handleRestore(params.row.id)}>
                            <i className="bi bi-arrow-clockwise" />
                        </Button>
                        <Button type="button" variant="outline-danger" className="ms-2" title="Xóa tài khoản" onClick={() => handleDeleteForever(params.row.id)}>
                            <i className="bi bi-trash-fill" />
                        </Button>
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
        setData(collections);
        setTrash(trashs);
    }, [collections, trashs]);
    return (
        <>
            <Helmet>
                <title>Danh sách phân loại dịch vụ</title>
                <meta name="description" content="Danh sách phân loại dịch vụ" />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <ButtonsComponent type="button" variant="primary" icon="add" title="Thêm mới" onClick={handleShow} />
                        </BreadcrumbComponent>
                        {/* Start Modal */}
                        <Modal show={show} onHide={handleClose}>
                            <Form
                                submit={(e) => {
                                    e.preventDefault();
                                    handleSubmit({ name });
                                }}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        <span>Thêm phân loại dịch vụ mới</span>
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group className="mb-3" controlId="name">
                                        <Form.Label>Nhập địa tên phân loại</Form.Label>
                                        <Form.Control type="text" placeholder="name abc" name="name" onChange={(e) => setName(e.target.value)} />
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
                        <Body title="Chuyên đề bài viết" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
