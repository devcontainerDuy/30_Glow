import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Layout from "@/Layouts/Index";

import {
    Button,
    Card,
    Col,
    Form,
    Image,
    InputGroup,
    Modal,
    Row,
    Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2";
import CKEditor from "@/Containers/CKEditor";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

function Edit({ products, crumbs, categories, brands }) {
    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [displayContent, setDisplayContent] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [idCategory, setIdCategory] = useState("");
    const [idBrand, setIdBrand] = useState("");
    const [inStock, setInStock] = useState(0);
    const [status, setStatus] = useState(0);
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleBack = () => {
        setName("");
        setPrice(0);
        setDiscount(0);
        setIdCategory("");
        setIdBrand("");
        setInStock(0);
        setFiles([]);
        setContent("");
        router.visit("/admin/products", {
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
            .put("/admin/products/" + products?.id, {
                name: name,
                price: price,
                discount: discount,
                content: content,
                id_category: idCategory,
                id_brand: idBrand,
                in_stock: inStock,
                status: status,
                image: files[0].file,
            })
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res.data.message);
                    router.visit("/admin/products/" + products?.id, {
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

    const handleStatus = (image) => {
        console.log(image);
        window.axios
            .put("/admin/galleries/" + image.id, {
                status: image.status === 0 ? 1 : 0,
                id_parent: image.id_parent,
            })
            .then((res) => {
                if (res.data.check == true) {
                    toast.success(res.data.message);
                    router.visit("/admin/products/" + products?.id, {
                        method: "get",
                    });
                } else {
                    window.notyf.open({
                        type: "error",
                        message: res.data.message,
                    });
                }
            })
            .catch((error) => {
                window.notyf.open({
                    type: "error",
                    message: error.response.data.msg,
                });
            });
    };

    const handleEditorBlur = (data) => {
        setContent(data);
    };

    useEffect(() => {
        setName(products.name);
        setSlug(products.slug);
        setPrice(products.price);
        setInStock(products.in_stock);
        setStatus(products.status);
        setFiles(products.gallery);
        setDiscount(products.discount);
        setContent(products.content);
        setIdCategory(products.id_category);
        setIdBrand(products.id_brand);
        // danh sách
        setCategory(categories);
        setBrand(brands);
    }, [products, categories, brands]);

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
                            <Button
                                className="ms-2"
                                variant="success"
                                type="submit"
                                disabled={loading}
                                onClick={handleSubmit}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            size="sm"
                                            animation="border"
                                            variant="secondary"
                                        />
                                        <span>Đang lưu...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-floppy-fill" />
                                        <span className="ms-2">
                                            Lưu cập nhật
                                        </span>
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
                                <Form
                                    onSubmit={handleSubmit}
                                    encType="multipart/form-data"
                                >
                                    <Row className="row-cols-2">
                                        <Col className="d-flex flex-column">
                                            {/* Tên sản phẩm */}
                                            <Form.Group
                                                className="mb-3"
                                                controlId="name"
                                            >
                                                <Form.Label>
                                                    Nhập tên sản phẩm
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tên sản phẩm..."
                                                    value={name}
                                                    onChange={(e) =>
                                                        setName(e.target.value)
                                                    }
                                                />
                                            </Form.Group>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="name"
                                            >
                                                <Form.Label>Slug</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={slug}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Row>
                                                <Col>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="price"
                                                    >
                                                        <Form.Label>
                                                            Giá sản phẩm
                                                        </Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control
                                                                type="number"
                                                                placeholder="100000"
                                                                value={price}
                                                                onChange={(e) =>
                                                                    setPrice(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            <InputGroup.Text>
                                                                VND
                                                            </InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={4}>
                                                    {/* Phần trăm giảm */}
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="discount"
                                                    >
                                                        <Form.Label>
                                                            Giảm giá
                                                        </Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control
                                                                type="number"
                                                                placeholder="10"
                                                                value={discount}
                                                                onChange={(e) =>
                                                                    setDiscount(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            <InputGroup.Text>
                                                                %
                                                            </InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="status"
                                                    >
                                                        <Form.Label>
                                                            Trạng thái
                                                        </Form.Label>
                                                        <Form.Check
                                                            checked={
                                                                status === 1
                                                            }
                                                            type="switch"
                                                            id="status"
                                                            label={
                                                                status === 1
                                                                    ? "Hoạt động"
                                                                    : "Tạm ngừng"
                                                            }
                                                            onChange={() =>
                                                                setStatus(
                                                                    status === 1
                                                                        ? 0
                                                                        : 1
                                                                )
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col>
                                                    {files &&
                                                        files
                                                            .filter(
                                                                (x) =>
                                                                    x.status ===
                                                                    1
                                                            )
                                                            ?.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <Image
                                                                        fluid
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="mb-3 rounded-1 w-100 h-100"
                                                                        src={
                                                                            "/storage/gallery/" +
                                                                            item.image
                                                                        }
                                                                        alt={
                                                                            item?.name
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                </Col>
                                                <Col
                                                    xs={4}
                                                    className="d-flex flex-column"
                                                >
                                                    {/* Chọn hiệu dữ liệu */}
                                                    <Dropzone
                                                        onChange={updateFiles}
                                                        className="mb-3"
                                                        accept="image/*"
                                                        value={files}
                                                    >
                                                        <Form.Label>
                                                            Ảnh sản phẩm
                                                        </Form.Label>
                                                        {files &&
                                                            files.length > 0 &&
                                                            files.map(
                                                                (
                                                                    file,
                                                                    index
                                                                ) => (
                                                                    <FileMosaic
                                                                        {...file}
                                                                        key={
                                                                            index
                                                                        }
                                                                        preview
                                                                        info
                                                                        onDelete={
                                                                            onDelete
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                    </Dropzone>
                                                    <Button
                                                        variant="primary"
                                                        type="button"
                                                        onClick={handleShow}
                                                    >
                                                        <i className="bi bi-images" />
                                                        <span className="ms-2">
                                                            Chọn hiệu dữ liệu
                                                        </span>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Modal
                                        size="lg"
                                        show={show}
                                        onHide={handleClose}
                                        // centered
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>
                                                Danh sách hình ảnh
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body
                                            className="overflow-auto"
                                            style={{
                                                maxHeight:
                                                    "calc(100vh - 210px)",
                                            }}
                                        >
                                            <Row>
                                                {files.length > 0 &&
                                                    files.map(
                                                        (image, index) => (
                                                            <>
                                                                <Col xs={3}>
                                                                    <Card>
                                                                        <Card.Img
                                                                            variant="top"
                                                                            fluid
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="mb-3 rounded-1 w-100 h-100"
                                                                            src={
                                                                                "/storage/gallery/" +
                                                                                image.image
                                                                            }
                                                                            alt={
                                                                                image.name
                                                                            }
                                                                        />
                                                                        <Card.Body className="p-2">
                                                                            <Button
                                                                                className="w-100"
                                                                                variant={
                                                                                    image.status ===
                                                                                    1
                                                                                        ? "secondary"
                                                                                        : "success"
                                                                                }
                                                                                type="button"
                                                                                disabled={
                                                                                    image.status ===
                                                                                    1
                                                                                }
                                                                                onClick={() =>
                                                                                    handleStatus(
                                                                                        image
                                                                                    )
                                                                                }
                                                                            >
                                                                                <span>
                                                                                    Mặc
                                                                                    định
                                                                                </span>
                                                                            </Button>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </Col>
                                                            </>
                                                        )
                                                    )}
                                            </Row>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button
                                                variant="secondary"
                                                onClick={handleClose}
                                            >
                                                <i className="bi bi-box-arrow-right" />
                                                <span className="ms-2">
                                                    Thoát ra
                                                </span>
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={handleClose}
                                            >
                                                <i className="bi bi-floppy-fill" />
                                                <span className="ms-2">
                                                    Lưu lại
                                                </span>
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>

                                    <Row className="row-cols-3">
                                        <Col>
                                            {/* Chọn danh mục */}
                                            <Form.Group
                                                className="mb-3"
                                                controlId="id_category"
                                            >
                                                <Form.Label>
                                                    Chọn danh mục
                                                </Form.Label>
                                                <Form.Select
                                                    name="id_category"
                                                    value={idCategory}
                                                    onChange={(e) =>
                                                        setIdCategory(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        -- Chọn --
                                                    </option>
                                                    {category.length > 0 ? (
                                                        category.map(
                                                            (item, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </option>
                                                            )
                                                        )
                                                    ) : (
                                                        <option value="">
                                                            Không có danh mục
                                                            nào
                                                        </option>
                                                    )}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            {/* Chọn thương hiệu */}
                                            <Form.Group
                                                className="mb-3"
                                                controlId="id_brand"
                                            >
                                                <Form.Label>
                                                    Chọn thương hiệu
                                                </Form.Label>
                                                <Form.Select
                                                    name="id_brand"
                                                    value={idBrand}
                                                    onChange={(e) =>
                                                        setIdBrand(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        -- Chọn --
                                                    </option>
                                                    {brand.length > 0 &&
                                                        brand.map(
                                                            (item, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </option>
                                                            )
                                                        )}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            {/* Số lượng trong kho */}
                                            <Form.Group
                                                className="mb-3"
                                                controlId="in_stock"
                                            >
                                                <Form.Label>
                                                    Số lượng trong kho
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Số lượng..."
                                                    value={inStock}
                                                    onChange={(e) =>
                                                        setInStock(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group
                                        className="mb-3"
                                        controlId="name"
                                    >
                                        <Form.Label>Nội dung chính</Form.Label>
                                        <CKEditor
                                            value={content}
                                            onBlur={handleEditorBlur}
                                        />
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
