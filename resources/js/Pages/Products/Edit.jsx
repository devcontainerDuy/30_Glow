import React, { useEffect, useState } from "react";
import Layout from "@/Layouts/Index";
import Title from "@/Containers/Title";
import { Card, Col, Container, Form, Image, InputGroup, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import CKEditor from "@/Containers/CKEditor";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

function Edit({ products, crumbs, categories, brands }) {
    const [data, setData] = useState({
        id: 0,
        name: "",
        slug: "",
        price: 0,
        discount: 0,
        in_stock: 0,
        status: 0,
        highlighted: 0,
        gallery: [],
        content: "",
        id_category: 0,
        id_brand: 0,
    });
    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleBack = () => {
        setData({});
        router.visit("/admin/products", {
            method: "get",
        });
    };

    const handleResset = () => {
        setTimeout(() => {
            router.visit("/admin/products/" + data?.id + "/edit", {
                method: "get",
            });
        }, 2000);
    };

    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
    };

    const onDelete = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };

    const handleEditorBlur = (content) => {
        setData((prev) => ({ ...prev, content }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const { gallery, ...dataItem } = data;
        window.axios
            .put("/admin/products/" + products?.id, dataItem)
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res.data.message);
                    const newData = res.data.data.find((x) => x.id === products.id);
                    newData && setData(newData);
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
                setLoading(true);
                window.axios
                    .delete("/admin/products/" + id)
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res.data.message);
                            setTimeout(() => {
                                router.visit("/admin/products", {
                                    method: "get",
                                });
                            }, 2000);
                        } else {
                            toast.warning(res.data.message);
                        }
                    })
                    .catch((error) => {
                        toast.error(error.response.data.message);
                    })
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleCreateImage = (e) => {
        e.preventDefault();

        if (files.length > 0) {
            window.axios
                .post(
                    "/admin/galleries",
                    {
                        images: files.map((x) => x.file),
                        id_parent: data.id,
                        status: 0,
                    },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    if (response.data.check === true) {
                        toast.success(response.data.message);
                        handleResset();
                    } else {
                        toast.warning(response.data.message);
                    }
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.message || "Có lỗi xảy ra.");
                });
        } else {
            toast.warning("Không có tệp nào được gửi.");
        }
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
                    handleResset();
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const handleDeleteImage = (id) => {
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
                    .delete("/admin/galleries/" + id)
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res.data.message);
                            handleResset();
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

    useEffect(() => {
        setData({ ...products });
        setCategory(categories);
        setBrand(brands);
    }, [products, categories, brands]);

    console.log(data?.gallery);

    return (
        <>
            <Helmet>
                <title>Cập nhật sản phẩm </title>
                <meta name="description" content="Cập nhật sản phẩm " />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <div className="d-flex gap-2 ">
                                <ButtonsComponent
                                    type="button"
                                    variant="danger"
                                    icon="delete"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(data.id);
                                    }}
                                />
                                <ButtonsComponent type="button" variant="secondary" icon="back" title="Quay lại" onClick={handleBack} />
                                <ButtonsComponent type="submit" variant="success" icon="edit" title="Cập nhật chỉnh sửa" loaded={loading} onClick={handleSubmit} />
                            </div>
                        </BreadcrumbComponent>

                        {/* Start DataGrid */}
                        <Container className="p-0">
                            <Row className="row-cols-1">
                                <Col>
                                    <Title props={"Cập nhật sản phẩm"} />
                                </Col>
                                <Col>
                                    <Form encType="multipart/form-data">
                                        <Row>
                                            <Col xs={9} className="d-flex flex-column">
                                                <Card className="p-3">
                                                    {/* Tên sản phẩm */}
                                                    <Form.Group className="mb-3" controlId="name">
                                                        <Form.Label>Nhập tên sản phẩm</Form.Label>
                                                        <Form.Control type="text" placeholder="Tên sản phẩm..." value={data?.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="name">
                                                        <Form.Label>Slug</Form.Label>
                                                        <Form.Control type="text" value={data?.slug} disabled />
                                                    </Form.Group>
                                                    <Row>
                                                        <Col>
                                                            <Form.Group className="mb-3" controlId="price">
                                                                <Form.Label>Giá sản phẩm</Form.Label>
                                                                <InputGroup className="mb-3">
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="100000"
                                                                        min={0}
                                                                        value={data?.price}
                                                                        onChange={(e) => setData({ ...data, price: e.target.value })}
                                                                    />
                                                                    <InputGroup.Text>VND</InputGroup.Text>
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            {/* Phần trăm giảm */}
                                                            <Form.Group className="mb-3" controlId="discount">
                                                                <Form.Label>Giảm giá</Form.Label>
                                                                <InputGroup className="mb-3">
                                                                    <Form.Control
                                                                        type="number"
                                                                        placeholder="10"
                                                                        min={0}
                                                                        value={data?.discount}
                                                                        onChange={(e) => setData({ ...data, discount: e.target.value })}
                                                                    />
                                                                    <InputGroup.Text>%</InputGroup.Text>
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={2}>
                                                            {/* Số lượng trong kho */}
                                                            <Form.Group className="mb-3" controlId="in_stock">
                                                                <Form.Label>Số lượng</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    placeholder="Số lượng..."
                                                                    min={0}
                                                                    value={data?.in_stock}
                                                                    onChange={(e) => setData({ ...data, in_stock: e.target.value })}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>

                                                    <Row className="row-cols-5">
                                                        <Col>
                                                            <Form.Group className="mb-3" controlId="status">
                                                                <Form.Label>Trạng thái</Form.Label>
                                                                <Form.Check
                                                                    className="my-auto"
                                                                    checked={data?.status === 1}
                                                                    type="switch"
                                                                    id="status"
                                                                    label={data?.status === 1 ? "Hoạt động" : "Tạm ngừng"}
                                                                    onChange={() => setData({ ...data, status: data?.status === 1 ? 0 : 1 })}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group className="mb-3" controlId="highlight">
                                                                <Form.Label>Bán chạy</Form.Label>
                                                                <Form.Check
                                                                    className="my-auto"
                                                                    type="switch"
                                                                    id="popular"
                                                                    checked={data?.highlighted === 1}
                                                                    label={data?.highlighted === 1 ? "Bán chạy" : "Không bán chạy"}
                                                                    onChange={() => setData({ ...data, highlighted: data?.highlighted === 1 ? 0 : 1 })}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>

                                                    {/* Nội dung chính */}
                                                    <Form.Group controlId="content">
                                                        <Form.Label>Nội dung chính</Form.Label>
                                                        <CKEditor value={data?.content} onBlur={handleEditorBlur} />
                                                    </Form.Group>
                                                </Card>
                                            </Col>
                                            <Col>
                                                <Card>
                                                    <Card.Header>Hình ảnh</Card.Header>
                                                    <Card.Body>
                                                        {data?.gallery &&
                                                            data?.gallery
                                                                .filter((x) => x.status === 1)
                                                                ?.map((item, index) => <Image fluid key={index} className="mb-3 rounded-2" src={"/storage/gallery/" + item.image} alt={item?.name} />)}
                                                        <div className="text-center">
                                                            <ButtonsComponent type="button" variant="primary" icon="image" title="Chọn hình ảnh" onClick={handleShow} />
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                                <Card className="mt-3">
                                                    <Card.Header>Danh mục</Card.Header>
                                                    <Card.Body>
                                                        {/* Chọn danh mục */}
                                                        <Form.Group controlId="id_category">
                                                            <Form.Select name="id_category" value={data?.id_category} onChange={(e) => setData({ ...data, id_category: e.target.value })}>
                                                                <option value="">-- Chọn --</option>
                                                                {category.length > 0 ? (
                                                                    category.map((item, index) => (
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
                                                <Card className="mt-3">
                                                    <Card.Header>Thương hiệu</Card.Header>
                                                    <Card.Body>
                                                        {/* Chọn thương hiệu */}
                                                        <Form.Group className="mb-3" controlId="id_brand">
                                                            <Form.Select name="id_brand" value={data?.id_brand} onChange={(e) => setData({ ...data, id_brand: e.target.value })}>
                                                                <option value="">-- Chọn --</option>
                                                                {brand.length > 0 &&
                                                                    brand.map((item, index) => (
                                                                        <option key={index} value={item.id}>
                                                                            {item.name}
                                                                        </option>
                                                                    ))}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <ModalComponent
                                            show={show}
                                            handleClose={handleClose}
                                            size="xl"
                                            title="Danh sách hình ảnh"
                                            body={
                                                <>
                                                    <Row className="row-cols-4 g-2">
                                                        <Col className="mb-3">
                                                            <Card style={{ minHeight: "331.5px" }}>
                                                                {/* Chọn hiệu dữ liệu */}
                                                                <Dropzone onChange={updateFiles} className="rounded-1" accept="image/*" value={files} style={{ minHeight: "271.5px" }}>
                                                                    {files && files.length > 0 ? (
                                                                        files.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={onDelete} />)
                                                                    ) : (
                                                                        <Form.Label>
                                                                            <i className="bi bi-cloud-arrow-up" style={{ fontSize: "5rem" }} />
                                                                        </Form.Label>
                                                                    )}
                                                                </Dropzone>
                                                                <Card.Body className="p-2 text-center">
                                                                    <ButtonsComponent type="button" variant="primary" title="Tải lên" icon="upload" onClick={handleCreateImage} />
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                        {data?.gallery?.length > 0 &&
                                                            data?.gallery?.map((item, index) => (
                                                                <>
                                                                    <Col key={index} className="mb-3">
                                                                        <Card style={{ minHeight: "331.5px" }}>
                                                                            <Card.Img
                                                                                variant="top"
                                                                                fluid
                                                                                className="mb-1 rounded-1 w-100 h-100"
                                                                                style={{ objectFit: "cover", minHeight: "271.5px" }}
                                                                                src={"/storage/gallery/" + item.image}
                                                                                alt={item.name}
                                                                            />
                                                                            <Card.Body className="p-2">
                                                                                <div className="d-flex gap-2 justify-content-center ">
                                                                                    <ButtonsComponent
                                                                                        type="button"
                                                                                        variant="primary"
                                                                                        title={item.status === 1 ? "Mặc định" : "Đặt mặc định"}
                                                                                        onClick={() => handleStatus(item)}
                                                                                        disabled={item.status === 1}
                                                                                    />
                                                                                    <ButtonsComponent type="button" variant="danger" icon="delete" onClick={() => handleDeleteImage(item.id)} />
                                                                                </div>
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                </>
                                                            ))}
                                                    </Row>
                                                </>
                                            }
                                            footer={
                                                <>
                                                    <ButtonsComponent type="button" variant="secondary" title="Thoát ra" icon="close" onClick={handleClose} />
                                                </>
                                            }
                                        />
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Edit;
