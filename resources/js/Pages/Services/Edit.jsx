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

function Edit({ service, collections, crumbs }) {
    const [collectionsData, setCollectionsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [price, setPrice] = useState(0);
    const [comparePrice, setComparePrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [summary, setSummary] = useState("");
    const [idCollection, setIdCollection] = useState(0);
    const [files, setFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState('');
    const [content, setContent] = useState("");
    const [status, setStatus] = useState(0);
    const [highlighted, setHighlighted] = useState(0);
    const [created, setCreated] = useState("");
    const [updated, setUpdated] = useState("");

    const handleBack = () => {
        setName("");
        setPrice(0);
        setComparePrice(0);
        setDiscount(0);
        setSummary("");
        setIdCollection(0);
        setFiles([]);
        setContent("");
        setStatus(0);
        setHighlighted(0);
        router.visit("/admin/services", {
            method: "get",
        });
    };

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFiles(selectedFile.name);
            const fileURL = URL.createObjectURL(selectedFile);
            setImagePreview(fileURL);
            console.log();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(imagePreview);

        window.axios
            .put("/admin/services/" + service?.id, {
                name: name,
                price: price,
                discount: discount,
                compare_price: comparePrice,
                summary: summary,
                id_collection: idCollection,
                image: imagePreview.file,
                content: content,
                status: status,
                highlighted: highlighted,
            })
            .then((res) => {
                if (res.data.check == true) {
                    toast.success(res.data.message);
                    router.visit("/admin/services/" + service?.id, {
                        method: "get",
                    });
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            })
            .finally(() => setLoading(false));
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
                    .delete("/admin/products/" + id)
                    .then((res) => {
                        if (res.data.check) {
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

    const handleEditorBlur = (data) => {
        setContent(data);
    };
    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    useEffect(() => {
        setName(service.name);
        setSlug(service.slug);
        setPrice(service.price);
        setComparePrice(service.compare_price);
        setDiscount(service.discount);
        setSummary(service.summary);
        setIdCollection(service.id_collection);
        setContent(service.content);
        setFiles(service.image);
        setStatus(service.status);
        setHighlighted(service.highlighted);
        setCreated(service.created_at);
        setUpdated(service.updated_at);
        // danh sách
        setCollectionsData(collections);
        console.log(files);
    }, [service, collections]);

    return (
        <>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button variant="secondary" onClick={handleBack}>
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
                                    <h4>Danh sách sản phẩm</h4>
                                </div>
                                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <Row>
                                        <Col xs={9} className="d-flex flex-column">
                                            {/* Tên sản phẩm */}
                                            <Card className="p-3">
                                                <Form.Group className="mb-3" controlId="name">
                                                    <Form.Label>Nhập tên sản phẩm</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Tên sản phẩm..."
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="slug">
                                                    <Form.Label>Slug</Form.Label>
                                                    <Form.Control type="text" value={slug} disabled />
                                                </Form.Group>
                                                <Row>
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="price">
                                                            <Form.Label>Giá sản phẩm</Form.Label>
                                                            <InputGroup className="mb-3">
                                                                <Form.Control
                                                                    type="number"
                                                                    placeholder="100000"
                                                                    value={price}
                                                                    onChange={(e) => setPrice(e.target.value)}
                                                                />
                                                                <InputGroup.Text>VND</InputGroup.Text>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={4}>
                                                        {/* Phần trăm giảm */}
                                                        <Form.Group className="mb-3" controlId="discount">
                                                            <Form.Label>Giảm giá</Form.Label>
                                                            <InputGroup className="mb-3">
                                                                <Form.Control
                                                                    type="number"
                                                                    placeholder="10"
                                                                    value={discount}
                                                                    onChange={(e) => setDiscount(e.target.value)}
                                                                />
                                                                <InputGroup.Text>%</InputGroup.Text>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className="row-cols-5">
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="status">
                                                            <Form.Label>Trạng thái</Form.Label>
                                                            <Form.Check
                                                                checked={status === 1}
                                                                type="switch"
                                                                id="status"
                                                                label={status === 1 ? "Hoạt động" : "Tạm ngừng"}
                                                                onChange={() => setStatus(status === 1 ? 0 : 1)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="status">
                                                            <Form.Label>Bán chạy</Form.Label>
                                                            <Form.Check
                                                                checked={highlighted === 1}
                                                                type="switch"
                                                                id="status"
                                                                label={highlighted === 1 ? "Bán chạy" : "Không bán chạy"}
                                                                onChange={() => setHighlighted(highlighted === 1 ? 0 : 1)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className="row-cols-12">
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="created">
                                                            <Form.Label>Ngày tạo</Form.Label>
                                                            <Form.Control type="text" value={formatCreatedAt(created)} disabled />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="updated">
                                                            <Form.Label>Ngầy cập nhật</Form.Label>
                                                            <Form.Control type="text" value={formatCreatedAt(updated)} disabled />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                {/* Nội dung chính */}
                                                <Form.Group controlId="name">
                                                    <Form.Label>Nội dung chính</Form.Label>
                                                    <CKEditor value={content} onBlur={handleEditorBlur} />
                                                </Form.Group>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <Card.Header>Hình ảnh</Card.Header>
                                                <Card.Body>
                                                    {files && (
                                                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => document.getElementById('fileInput').click()}>
                                                            <Image
                                                                fluid
                                                                className="mb-3 rounded-1 w-100 h-100"
                                                                src={imagePreview ? imagePreview : `/storage/services/${files}`} // Sử dụng URL đã tạo cho ảnh xem trước
                                                                alt={files}
                                                            />
                                                            <Form.Control
                                                                id="fileInput"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                                style={{ display: 'none' }} // Ẩn input file
                                                            />
                                                        </div>
                                                    )}
                                                    {!files && (
                                                        <Form.Group>
                                                            <Form.Label>Ảnh sản phẩm</Form.Label>
                                                            <Form.Control
                                                                id="fileInput"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                                style={{ display: 'none' }} // Ẩn input file
                                                            />
                                                        </Form.Group>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                            <Card className="mt-3">
                                                <Card.Header>Danh mục</Card.Header>
                                                <Card.Body>
                                                    {/* Chọn danh mục */}
                                                    <Form.Group controlId="id_collection">
                                                        <Form.Select name="id_collection" value={idCollection} onChange={(e) => setIdCollection(e.target.value)}>
                                                            <option value="">-- Chọn --</option>
                                                            {collections.length > 0 ? (
                                                                collections.map((item, index) => (
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
