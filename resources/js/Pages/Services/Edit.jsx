import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Layout from "@/Layouts/Index";

import { Button, Card, Col, Form, Image, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import CKEditor from "@/Containers/CKEditor";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";

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
    const [content, setContent] = useState("");
    const [status, setStatus] = useState(0);
    const [highlighted, setHighlighted] = useState(0);

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

    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
    };

    const onDelete = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        window.axios
            .put("/admin/services/" + service?.id, {
                name: name,
                price: price,
                discount: discount,
                compare_price: comparePrice,
                summary: summary,
                id_collection: idCollection,
                image: files.file,
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
                                    <h4>Danh sách sản phẩm </h4>
                                </div>
                                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <Row className="row-cols-2">
                                        <Col className="d-flex flex-column">
                                            {/* Tên sản phẩm */}
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Nhập tên sản phẩm</Form.Label>
                                                <Form.Control type="text" placeholder="Tên sản phẩm..." value={name} onChange={(e) => setName(e.target.value)} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Slug</Form.Label>
                                                <Form.Control type="text" value={slug} disabled />
                                            </Form.Group>
                                            <Row>
                                                <Col>
                                                    <Form.Group className="mb-3" controlId="price">
                                                        <Form.Label>Giá sản phẩm</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control type="number" placeholder="100000" value={price} onChange={(e) => setPrice(e.target.value)} />
                                                            <InputGroup.Text>VND</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={4}>
                                                    {/* Phần trăm giảm */}
                                                    <Form.Group className="mb-3" controlId="discount">
                                                        <Form.Label>Giảm giá</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control type="number" placeholder="10" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                                            <InputGroup.Text>%</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group className="mb-3" controlId="status">
                                                        <Form.Label>Trạng thái</Form.Label>
                                                        <Form.Check
                                                            checked={status === 1}
                                                            type="switch"
                                                            id="status"
                                                            label={status === 1 ? "Hoạt động" : "Tạm ngừng"}
                                                            onChange={() => setStatus(status === 1 ? 0 : 1)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col>{files && <Image fluid className="mb-3 rounded-1 w-100 h-100" src={"/storage/services/" + files} alt={files} />}</Col>
                                                <Col xs={4} className="d-flex flex-column">
                                                    {/* Chọn hiệu dữ liệu */}
                                                    <Dropzone onChange={updateFiles} className="mb-3" accept="image/*">
                                                        <Form.Label>Ảnh sản phẩm</Form.Label>
                                                        <FileMosaic preview info onDelete={onDelete} />
                                                    </Dropzone>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row className="row-cols-3">
                                        <Col>
                                            {/* Chọn danh mục */}
                                            <Form.Group className="mb-3" controlId="id_category">
                                                <Form.Label>Chọn danh mục</Form.Label>
                                                <Form.Select name="id_category" value={idCollection} onChange={(e) => setIdCategory(e.target.value)}>
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
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="name">
                                        <Form.Label>Nội dung chính</Form.Label>
                                        <CKEditor value={content} onBlur={handleEditorBlur} />
                                    </Form.Group>
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
