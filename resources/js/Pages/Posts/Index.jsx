import React, { useEffect, useMemo, useState } from "react";
import { FormControlLabel, Switch, MenuItem, FormControl, Select } from "@mui/material";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Col, Form, Image, Row } from "react-bootstrap";
import CKEditor from "@/Containers/CKEditor";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";
import { router } from "@inertiajs/react";
import { Helmet } from "react-helmet";

function Index({ posts, trashs, collections, crumbs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    const [collected, setCollected] = useState([]);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [summary, setSummary] = useState("");
    const [idCollection, setIdCollection] = useState(0);
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState("");

    const handleClose = () => {
        setShow(false);
        setName("");
        setSummary("");
        setIdCollection(0);
        setFiles([]);
        setContent("");
    };
    const handleShow = () => setShow(true);

    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
        console.log(incommingFiles);
    };

    const onDelete = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };

    const handleEditorBlur = (data) => {
        setContent(data);
    };

    const { handleSubmit, loading } = useSubmitForm("/admin/posts", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/posts", setData);
    const { handleDelete, handleRestore, handleDeleteForever } = useDelete("/admin/posts", setData, setTrash);

    const handleView = (id) => {
        router.visit("/admin/posts/" + id + "/edit", {
            method: "get",
        });
    };

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "title",
            headerName: "Tiêu đề bài viết",
            width: 300,
            editable: true,
        },
        {
            field: "image",
            headerName: "Hình ảnh",
            width: 140,
            renderCell: (params) => {
                return (
                    <>
                        <Image fluid className="rounded-full p-0 m-0" src={"/storage/posts/" + params.value} alt={params.value} />
                    </>
                );
            },
        },
        {
            field: "id_collection",
            headerName: "Loại dịch vụ",
            width: 240,
            renderCell: (params) => {
                let idCollection = params.row.id_collection || "";
                return (
                    <>
                        <FormControl fullWidth>
                            <Select id="simple-select" value={idCollection} onChange={(e) => handleCellEditStop(params.row.id, "id_collection", e.target.value)} displayEmpty>
                                <MenuItem value="">-- Chọn --</MenuItem>
                                {collected.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>
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
            field: "highlighted",
            headerName: "Nổi bật",
            width: 160,
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
            field: "status",
            headerName: "Trạng thái",
            width: 160,
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
            width: 140,
            renderCell: (params) => {
                return (
                    <>
                        <div className="d-flex gap-2 align-items-center mt-2">
                            <ButtonsComponent type="button" variant="outline-info" icon="view" onClick={() => handleView(params.row.id)} />
                            <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDelete(params.row.id)} />
                        </div>
                    </>
                );
            },
        },
    ]);

    const columnsTrash = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "title",
            headerName: "Tiêu đề bài viết",
            width: 300,
        },
        {
            field: "image",
            headerName: "Hình ảnh",
            width: 140,
            renderCell: (params) => {
                return (
                    <>
                        <Image fluid className="rounded-full p-0 m-0" src={"/storage/posts/" + params.value} alt={params.value} />
                    </>
                );
            },
        },
        {
            field: "id_collection",
            headerName: "Loại dịch vụ",
            width: 240,
            renderCell: (params) => {
                let idCollection = params.row.id_collection || "";
                return (
                    <>
                        <FormControl fullWidth>
                            <Select id="simple-select" value={idCollection} disabled displayEmpty>
                                <MenuItem value="">-- Chọn --</MenuItem>
                                {collected.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>
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
            field: "highlighted",
            headerName: "Nổi bật",
            width: 140,
            renderCell: (params) => {
                return (
                    <>
                        <FormControlLabel control={<Switch checked={params.row.highlighted === 1} disabled />} label={params.row.highlighted ? "Nổi bật" : "Ẩn"} />
                    </>
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 140,
            renderCell: (params) => {
                return (
                    <>
                        <FormControlLabel control={<Switch checked={params.row.status === 1} disabled />} label={params.row.status ? "Hoạt động" : "Ẩn"} />
                    </>
                );
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 140,
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

    const tabsData = useMemo(() => [
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
    ]);

    useEffect(() => {
        setData(posts);
        setTrash(trashs);
        setCollected(collections);
    }, [posts, trashs, collections]);

    return (
        <>
            <Helmet>
                <title>Danh sách bài viết</title>
                <meta name="description" content="Danh sách bài viết" />
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
                                handleSubmit({
                                    title: name,
                                    summary: summary,
                                    image: files[0]?.file,
                                    id_collection: idCollection,
                                    content: content,
                                });
                            }}
                            size="xl"
                            title="Thêm mới"
                            loaded={loading}
                            body={
                                <>
                                    <Row className="row-cols-2">
                                        <Col xs="8" className="d-flex flex-column">
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Nhập tiêu đề bài viết</Form.Label>
                                                <Form.Control type="text" placeholder="name abc" name="name" onChange={(e) => setName(e.target.value)} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="collection">
                                                <Form.Label>Chọn chuyên đề</Form.Label>
                                                <Form.Select name="id_collection" onChange={(e) => setIdCollection(e.target.value)}>
                                                    <option value="">-- Chọn --</option>
                                                    {collected.length > 0 &&
                                                        collected.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>Mổ tả ngắn</Form.Label>
                                                <Form.Control as="textarea" placeholder="Nội dung mô tả" rows={3} onChange={(e) => setSummary(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs="4">
                                            <Form.Group controlId="image">
                                                <Form.Label>Ảnh đại diện bài viết</Form.Label>
                                                <Dropzone className="dropzone" onChange={updateFiles} accept="image/*" maxFiles={1} value={files}>
                                                    {files && files.length > 0 ? (
                                                        files.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={onDelete} />)
                                                    ) : (
                                                        <Form.Label>
                                                            <i className="bi bi-cloud-arrow-up" style={{ fontSize: "5rem" }} />
                                                        </Form.Label>
                                                    )}
                                                </Dropzone>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="content">
                                        <Form.Label>Nội dung chính</Form.Label>
                                        <CKEditor value={content} onBlur={handleEditorBlur} />
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}

                        {/* Start DataGrid */}
                        <Body title="Danh sách bài viết" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
