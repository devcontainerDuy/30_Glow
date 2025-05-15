import React, { useEffect, useMemo, useState } from "react";
import { Box, FormControlLabel, Select, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { FormControl, MenuItem } from "@mui/material";
import CKEditor from "@/Containers/CKEditor";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";
import { router } from "@inertiajs/react";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";
import ModalComponent from "@/Components/ModalComponent";

function Index({ sitemap, crumbs, trashs }) {
    const [data, setData] = useState([]);
    const [show, setshow] = useState(false);
    const [page, setPage] = useState("");
    const [staticPage, setStaticPage] = useState(null);
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");
    const [trash, setTrash] = useState([]);

    const handleClose = () => {
        setshow(false);
        setPage("");
        setStaticPage(null);
        setContent("");
        setUrl("");
    };
    const handleShow = () => setshow(true);

    const handleView = (id) => {
        router.visit("/admin/sitemap/" + id + "/edit", {
            method: "get",
        });
    };

    const { handleSubmit, loading } = useSubmitForm("/admin/sitemap", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/sitemap", setData);
    const { handleDelete, handleRestore, handleDeleteForever, loading: loaded } = useDelete("/admin/sitemap", setData, setTrash);

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "page",
            headerName: "Page",
            width: 180,
        },
        {
            field: "content",
            headerName: "Nội dung",
            width: 220,
        },
        {
            field: "url",
            headerName: "URL",
            width: 200,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 180,
            renderCell: (params) => (
                <FormControlLabel
                    control={<Switch checked={params.row.status === 1} onClick={() => handleCellEditStop(params.row.id, "status", params.row.status === 1 ? 0 : 1)} />}
                    label={params.row.status ? "Hoạt động" : "Ẩn"}
                />
            ),
        },
        {
            field: "static_page",
            headerName: "Trạng thái",
            width: 200,
            renderCell: (params) => {
                let staticPage = params.row.static_page || "";

                return (
                    <FormControl fullWidth>
                        <Select
                            id="simple-select"
                            value={staticPage}
                            displayEmpty
                            onChange={(e) => {
                                handleCellEditStop(params.row.id, "static_page", e.target.value);
                                handleCellEditStop(params.row.id, "static_page", e.target.value);
                            }}
                        >
                            <MenuItem value={1}>Trang tĩnh</MenuItem>
                            <MenuItem value={2}>Trang link</MenuItem>
                        </Select>
                    </FormControl>
                );
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <Button type="button" variant="outline-info" title="Xem chi tiết sitemap" onClick={() => handleView(params.row.id)}>
                        <i className="bi bi-exclamation-circle" />
                    </Button>
                    <Button className="ms-2" type="button" variant="outline-danger" title="Xóa sản phẩm" onClick={() => handleDelete(params.row.id)}>
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);
    const columnsTrash = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "page",
            headerName: "Page",
            width: 180,
        },
        {
            field: "content",
            headerName: "Nội dung",
            width: 220,
        },
        {
            field: "url",
            headerName: "URL",
            width: 200,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 180,
            renderCell: (params) => (
                <FormControlLabel
                    control={<Switch checked={params.row.status === 1} onClick={() => handleCellEditStop(params.row.id, "status", params.row.status === 1 ? 0 : 1)} />}
                    label={params.row.status ? "Hoạt động" : "Ẩn"}
                />
            ),
        },
        {
            field: "static_page",
            headerName: "Trạng thái",
            width: 200,
            renderCell: (params) => {
                let staticPage = params.row.static_page || "";

                return (
                    <FormControl fullWidth>
                        <Select
                            id="simple-select"
                            value={staticPage}
                            displayEmpty
                            onChange={(e) => {
                                handleCellEditStop(params.row.id, "static_page", e.target.value);
                            }}
                        >
                            <MenuItem value={1}>Trang tĩnh</MenuItem>
                            <MenuItem value={2}>Trang link</MenuItem>
                        </Select>
                    </FormControl>
                );
            },
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
                    <Button type="button" variant="outline-danger" className="ms-2" title="Xóa tài khoản" onClick={() => handleDeleteForever(params.row.id)}>
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);
    const tabsData = [
        {
            eventKey: "list",
            title: "Danh sách",
            data: data,
            columns: columns,
            handleCellEditStart: handleCellEditStart,
        },
        {
            eventKey: "trash",
            title: "Thùng rác",
            data: trash,
            columns: columnsTrash,
            handleCellEditStart: handleCellEditStart,
        },
    ];

    const handleEditorBlur = (data) => {
        setContent(data);
    };
    useEffect(() => {
        setData(sitemap);
        setTrash(trashs);
    }, [sitemap, trashs]);

    return (
        <>
            <Helmet>
                <title>Sitemap </title>
                <meta name="description" content="Sitemap " />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button type="button" variant="primary" onClick={handleShow}>
                                <i className="bi bi-plus-lg" />
                                <span className="ms-2">Thêm Sitemap Mới</span>
                            </Button>
                        </BreadcrumbComponent>
                        {/* Start Modal */}
                        <ModalComponent
                            show={show}
                            close={handleClose}
                            submit={(e) => {
                                e.preventDefault();
                                handleSubmit({ page: page, content: content, url: url, static_page: staticPage });
                            }}
                            size="md"
                            title="Thêm mới"
                            loaded={loading}
                            body={
                                <>
                                    <Form>
                                        <Row className="row-cols-2">
                                            <Col>
                                                <Form.Group className="mb-3" controlId="page">
                                                    <Form.Label>Tên Trang</Form.Label>
                                                    <Form.Control type="text" placeholder="Nhập tên trang" value={page} onChange={(e) => setPage(e.target.value)} required />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3" controlId="staticPage">
                                                    <Form.Label>Trang tĩnh</Form.Label>
                                                    <Form.Select value={staticPage} onChange={(e) => setStaticPage(Number(e.target.value))}>
                                                        <option value={null}>Chọn loại trang </option>
                                                        <option value={1}>Trang tĩnh </option>
                                                        <option value={2}>Trang link </option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-3" controlId="page">
                                            <Form.Label>URL</Form.Label>
                                            <Form.Control type="text" placeholder="Nhập url..." value={url} onChange={(e) => setUrl(e.target.value)} required />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="name">
                                            <Form.Label>Nội dung chính</Form.Label>
                                            <CKEditor value={content} onBlur={handleEditorBlur} />
                                        </Form.Group>
                                    </Form>
                                </>
                            }
                        />
                        {/* End Modal */}
                        {/* Start DataGrid */}
                        <Body title="Sitemap" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
