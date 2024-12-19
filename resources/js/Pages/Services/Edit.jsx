import React, { useEffect, useState } from "react";
import Layout from "@/Layouts/Index";
import Title from "@/Containers/Title";
import { Button, Card, Col, Container, Form, Image, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
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
import axios from "axios";

function Edit({ service, collections, crumbs }) {
    const [data, setData] = useState({
        id: 0,
        name: "",
        slug: "",
        price: 0,
        discount: 0,
        compare_price: 0,
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
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleBack = () => {
        setData({});
        router.visit("/admin/services", {
            method: "get",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const { image, ...rest } = data;

        window.axios
            .put(`/admin/services/${data?.id}`, rest)
            .then((res) => {
                if (res.data.check == true) {
                    toast.success(res.data.message);
                    const newData = res.data.data.find((x) => x.id === products.id);
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
                    .delete("/admin/services/" + id)
                    .then((res) => {
                        if (res.data.check) {
                            toast.success(res.data.message);
                            router.visit("/admin/services/", {
                                method: "get",
                            });
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
        setData({ ...data, content: data });
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
                    "/admin/services/" + data?.id + "/upload",
                    { image: files[0].file },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((res) => {
                    if (res.data.check === true) {
                        setData({ ...data, image: res.data.data?.image });
                        toast.success(res.data.message);
                        setTimeout(() => {
                            router.visit("/admin/services/" + data?.id, {
                                method: "get",
                            });
                        }, 1000);
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
                        <Container>
                            <Row className="row-cols-1">
                                <Col>
                                    <Title props={"Cập nhật sản phẩm"} />
                                </Col>
                                <Form encType="multipart/form-data">
                                    <Row>
                                        <Col xs={9} className="d-flex flex-column">
                                            {/* Tên sản phẩm */}
                                            <Card className="p-3">
                                                <Form.Group className="mb-3" controlId="name">
                                                    <Form.Label>Nhập tên sản phẩm</Form.Label>
                                                    <Form.Control type="text" placeholder="Tên sản phẩm..." value={data?.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="slug">
                                                    <Form.Label>Slug</Form.Label>
                                                    <Form.Control type="text" value={data?.slug} disabled />
                                                </Form.Group>
                                                <Row>
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="price">
                                                            <Form.Label>Giá sản phẩm</Form.Label>
                                                            <InputGroup className="mb-3">
                                                                <Form.Control type="number" placeholder="100000" value={data?.price} onChange={(e) => setData({ ...data, price: e.target.value })} />
                                                                <InputGroup.Text>VND</InputGroup.Text>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={4}>
                                                        {/* Phần trăm giảm */}
                                                        <Form.Group className="mb-3" controlId="discount">
                                                            <Form.Label>Giảm giá</Form.Label>
                                                            <InputGroup className="mb-3">
                                                                <Form.Control type="number" placeholder="10" value={data?.discount} onChange={(e) => setData({ ...data, discount: e.target.value })} />
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
                                                        <Image fluid src={"/storage/services/" + data?.image} alt={data?.name} className="mb-3 rounded-2" />
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

                                    <ModalComponent
                                        show={show}
                                        close={handleClose}
                                        title="Thay đổi ảnh"
                                        body={
                                            <>
                                                {/* Chọn hiệu dữ liệu */}
                                                <Form.Group>
                                                    <Form.Label>Chọn ảnh thay đổi</Form.Label>
                                                    <Dropzone onChange={updateFiles} className="rounded-1" accept="image/*" maxFiles={1} multiple={false} value={files}>
                                                        {files && files.length > 0 ? (
                                                            files.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={onDelete} />)
                                                        ) : (
                                                            <Form.Label>
                                                                <i className="bi bi-cloud-arrow-up" style={{ fontSize: "5rem" }} />
                                                            </Form.Label>
                                                        )}
                                                    </Dropzone>
                                                </Form.Group>
                                            </>
                                        }
                                        footer={
                                            <>
                                                <ButtonsComponent type="button" variant="secondary" icon="close" title="Thoát ra" onClick={handleClose} />
                                            </>
                                        }
                                    />
                                </Form>
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
