import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Layout from "@/Layouts/Index";
import { Button, Card, Col, Form, Image, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import CKEditor from "@/Containers/CKEditor";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";
import axios from "axios";
import { Helmet } from "react-helmet";

function Edit({ service, collections, crumbs }) {
    const [data, setData] = useState({
        title: "",
        slug: "",
        summary: "",
        id_collection: 0,
        image: null,
        content: "",
        status: 0,
        highlighted: 0,
        created: "",
        updated: "",
    });
    const [collectionsData, setCollectionsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [files, setFiles] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleBack = () => {
        setData({});
        router.visit("/admin/posts", {
            method: "get",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const { image, ...newData } = data;

        window.axios
            .put(`/admin/posts/${data?.id}`, { ...newData })
            .then((res) => {
                if (res.data.check == true) {
                    toast.success(res.data.message);
                    const newData = res.data.data.find((x) => x.id === data.id);
                    newData && setData(newData);
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Có lỗi xảy ra");
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Xóa mục?",
            text: "Bạn chắc chắn xóa mục này!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                window.axios
                    .delete("/admin/posts/" + id)
                    .then((res) => {
                        if (res.data.check) {
                            toast.success(res.data.message);
                            setTimeout(() => {
                                router.visit("/admin/posts/", {
                                    method: "get",
                                });
                            }, 2000);
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

    const handleEditorBlur = (content) => {
        setData((prev) => ({ ...prev, content }));
    };

    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles.map((f) => Object.assign(f, { preview: URL.createObjectURL(f.file) })));
    };

    const onDelete = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };

    const handleSetImage = () => {
        if (files.length > 0) {
            axios
                .post(
                    "/admin/posts/" + data?.id + "/upload",
                    { image: files[0].file },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((res) => {
                    if (res.data.check === true) {
                        toast.success(res.data.message);
                        const newData = res.data.data.find((x) => x.id === data.id);
                        newData && setData(newData);
                    } else {
                        toast.warn(res.data.message);
                    }
                })
                .catch((err) => {
                    toast.error(err.response.data.message || "Có lỗi xảy ra");
                })
                .finally(() => handleClose());
        } else {
            toast.warning("Vui lòng chọn một ảnh.");
        }
    };

    useEffect(() => {
        setData({
            ...service,
            created: formatCreatedAt(service?.created_at),
            updated: formatCreatedAt(service?.updated_at),
        });
        setCollectionsData(collections);
    }, [service, collections]);

    return (
        <>
            <Helmet>
                <title>Cập nhật bài viết </title>
                <meta name="description" content="Cập nhật bài viết " />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button variant="danger" onClick={() => handleDelete(service?.id)}>
                                <i className="bi bi-trash-fill" />
                            </Button>
                            <Button className="ms-2" variant="secondary" onClick={handleBack}>
                                <i className="bi bi-box-arrow-right" />
                                <span className="ms-2">Quay lại</span>
                            </Button>
                            <Button className="ms-2" variant="success" type="submit" disabled={loading} onClick={handleSubmit}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" animation="border" variant="secondary" />
                                        <span>Đang lưu...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-floppy-fill" />
                                        <span className="ms-2">Lưu cập nhật</span>
                                    </>
                                )}
                            </Button>
                        </BreadcrumbComponent>

                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Cập nhật bài viết</h4>
                                </div>
                                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <Row>
                                        <Col xs={9} className="d-flex flex-column">
                                            {/* Tên sản phẩm */}
                                            <Card className="p-3">
                                                <Form.Group className="mb-3" controlId="title">
                                                    <Form.Label>Tiêu đề bài viết</Form.Label>
                                                    <Form.Control type="text" placeholder="Tên tiêu đề bài viết..." value={data?.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="slug">
                                                    <Form.Label>Slug</Form.Label>
                                                    <Form.Control type="text" value={data?.slug} disabled />
                                                </Form.Group>
                                                <Row className="row-cols-5">
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="status">
                                                            <Form.Label>Trạng thái</Form.Label>
                                                            <Form.Check
                                                                checked={data?.status === 1}
                                                                type="switch"
                                                                id="status"
                                                                label={data?.status === 1 ? "Hoạt động" : "Tạm ngừng"}
                                                                onChange={() => setData({ ...data, status: data?.status === 1 ? 0 : 1 })}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="status">
                                                            <Form.Label>Bán chạy</Form.Label>
                                                            <Form.Check
                                                                checked={data?.highlighted === 1}
                                                                type="switch"
                                                                id="status"
                                                                label={data?.highlighted === 1 ? "Bán chạy" : "Không bán chạy"}
                                                                onChange={() => setData({ ...data, highlighted: data?.highlighted === 1 ? 0 : 1 })}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className="row-cols-12">
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="created">
                                                            <Form.Label>Ngày tạo</Form.Label>
                                                            <Form.Control type="text" value={data?.created} disabled />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="updated">
                                                            <Form.Label>Ngầy cập nhật</Form.Label>
                                                            <Form.Control type="text" value={data?.updated} disabled />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                {/* Nội dung chính */}
                                                <Form.Group controlId="name">
                                                    <Form.Label>Nội dung chính</Form.Label>
                                                    <CKEditor value={data?.content} onBlur={handleEditorBlur} />
                                                </Form.Group>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <Card.Header>Hình ảnh</Card.Header>
                                                <Card.Body>
                                                    {/* Hình ảnh */}
                                                    {files[0] && files.length > 0 && files[0].preview ? (
                                                        <Image fluid src={files[0].preview} alt={data?.name} className="mb-3 rounded-2" />
                                                    ) : (
                                                        <Image fluid src={"/storage/posts/" + data?.image} alt={data?.name} className="mb-3 rounded-2" />
                                                    )}
                                                    <Button className="w-100" variant="primary" type="button" onClick={handleShow}>
                                                        <i className="bi bi-images" />
                                                        <span className="ms-2">Thay đổi ảnh</span>
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                            <Card className="mt-3">
                                                <Card.Header>Danh mục</Card.Header>
                                                <Card.Body>
                                                    {/* Chọn danh mục */}
                                                    <Form.Group controlId="id_collection">
                                                        <Form.Select name="id_collection" value={data?.id_collection} onChange={(e) => setData({ ...data, id_collection: e.target.value })}>
                                                            <option value="">-- Chọn --</option>
                                                            {collectionsData.length > 0 ? (
                                                                collectionsData.map((item, index) => (
                                                                    <option key={index} value={item.id}>
                                                                        {item.name}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option value="">Không có danh mục nào</option>
                                                            )}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Thay đổi hình ảnh</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {/* Chọn hiệu dữ liệu */}
                                            <Dropzone onChange={updateFiles} className="rounded-1" accept="image/*" maxFiles={1} multiple={false} value={files}>
                                                {files && files.length > 0 ? (
                                                    files.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={onDelete} />)
                                                ) : (
                                                    <Form.Label>
                                                        <i className="bi bi-cloud-arrow-up" style={{ fontSize: "5rem" }} />
                                                    </Form.Label>
                                                )}
                                            </Dropzone>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                Đóng
                                            </Button>
                                            <Button variant="primary" onClick={handleSetImage}>
                                                Chọn ảnh
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </Form>
                            </Box>
                        </Col>
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Edit;
