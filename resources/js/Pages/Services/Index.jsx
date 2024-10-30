import React, { useEffect, useMemo, useState } from "react";
import { Box, FormControlLabel, Select, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Layout from "@/Layouts/Index";

import { Button, Col, Form, Image, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import CKEditor from "@/Containers/CKEditor";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

function Index({ services, collections, crumbs }) {
    const [data, setData] = useState([]);
    const [collected, setCollected] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [comparePrice, setComparePrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [summary, setSummary] = useState("");
    const [idCollection, setIdCollection] = useState(0);
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState("");

    const handleClose = () => {
        setShow(false);
        setName("");
        setPrice(0);
        setComparePrice(0);
        setDiscount(0);
        setSummary("");
        setIdCollection(0);
        setFiles([]);
        setContent("");
    };
    const handleShow = () => setShow(true);

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
            .post(
                "/admin/services",
                {
                    name: name,
                    price: price,
                    compare_price: comparePrice,
                    discount: discount,
                    summary: summary,
                    id_collection: idCollection,
                    image: files[0].file,
                    content: content,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res.data.message);
                    setData(res.data.data);
                    handleClose();
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.msg);
            })
            .finally(() => setLoading(false));
    };

    const handleCellEditStart = (id, field, value) => {
        setEditingCells((prev) => ({ ...prev, [id + "-" + field]: value }));
    };

    const handleCellEditStop = (id, field, value) => {
        const originalValue = editingCells[id + "-" + field];

        if (originalValue !== value) {
            window.axios
                .put("/admin/services/" + id, {
                    [field]: value,
                })
                .then((res) => {
                    if (res.data.check === true) {
                        toast.success(res.data.message);
                        setData(res.data.data);
                    } else {
                        toast.warning(res.data.message);
                    }
                })
                .catch((error) => {
                    toast.error(error.response.data.msg);
                });
        } else {
            setEditingCells((prev) => {
                const newEditingCells = { ...prev };
                delete newEditingCells[id + "-" + field];
                return newEditingCells;
            });
            toast.info("Không có chỉnh sửa.");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Xóa mục?",
            text: "Bạn chắc chắn muốn xóa mục này!",
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
                        if (res.data.check == true) {
                            toast.success(res.data.message);
                            setData(res.data.data);
                        } else {
                            toast.warning(res.data.message);
                        }
                    })
                    .catch((error) => {
                        toast.error(error.response.data.msg);
                    });
            }
        });
    };

    const handleView = (id) => {
        router.visit("/admin/services/" + id + "/edit", {
            method: "get",
        });
    };

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tiêu đề dịch vụ",
            width: 220,
            editable: true,
        },
        {
            field: "price",
            headerName: "Giá Cơ bản",
            width: 120,
            editable: true,
            renderCell: (params) => {
                return new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(params.value);
            },
        },
        {
            field: "compare_price",
            headerName: "Giá gốc",
            width: 120,
            editable: true,
            renderCell: (params) => {
                return new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(params.value);
            },
        },
        {
            field: "discount",
            headerName: "Giảm %",
            width: 120,
            editable: true,
            renderCell: (params) => {
                return new Intl.NumberFormat("vi-VN", {
                    style: "percent",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                }).format(params.value / 100);
            },
        },
        {
            field: "image",
            headerName: "Hình ảnh",
            width: 140,
            renderCell: (params) => {
                return (
                    <>
                        <Image fluid className="rounded-full p-0 m-0" src={"/storage/services/" + params.value} alt={params.value} />
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
            width: 140,
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
                        <Button type="button" variant="outline-info" title="Xem chi tiết sản phẩm" onClick={() => handleView(params.row.id)}>
                            <i className="bi bi-exclamation-circle" />
                        </Button>
                        <Button type="button" variant="outline-danger" className="ms-2" title="Xóa tài khoản" onClick={() => handleDelete(params.row.id)}>
                            <i className="bi bi-trash-fill" />
                        </Button>
                    </>
                );
            },
        },
    ]);

    const handleEditorBlur = (data) => {
        setContent(data);
    };

    useEffect(() => {
        setData(services);
        setCollected(collections);
    }, [services, collections]);

    return (
        <>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button type="button" variant="primary" onClick={handleShow}>
                                <i className="bi bi-plus-lg" />
                                <span className="ms-2">Thêm dịch vụ mới</span>
                            </Button>
                        </BreadcrumbComponent>

                        {/* Start Modal */}
                        <Modal show={show} onHide={handleClose} size="lg" centered>
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        <span>Thêm dịch vụ mới</span>
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body
                                    className="overflow-auto"
                                    style={{
                                        maxHeight: "calc(100vh - 210px)",
                                    }}
                                >
                                    <Row className="row-cols-2">
                                        <Col className="d-flex flex-column">
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Nhập địa tên dịch vụ</Form.Label>
                                                <Form.Control type="text" placeholder="name abc" name="name" onChange={(e) => setName(e.target.value)} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Chọn loại dịch vụ</Form.Label>
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
                                        </Col>
                                        <Col>
                                            <Dropzone onChange={updateFiles} className="mb-3" accept="image/*" value={files}>
                                                {files && files.length > 0 ? (
                                                    files.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={onDelete} />)
                                                ) : (
                                                    <Form.Label>Ảnh đại diện dịch vụ</Form.Label>
                                                )}
                                            </Dropzone>
                                        </Col>
                                    </Row>

                                    <Row className="row-cols-3">
                                        <Col>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Giá gốc</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control type="number" placeholder="100000" onChange={(e) => setComparePrice(e.target.value)} />
                                                    <InputGroup.Text>VND</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Giá cơ bản</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control type="number" placeholder="80000" onChange={(e) => setPrice(e.target.value)} />
                                                    <InputGroup.Text>VND</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Phần trăm giảm</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control type="number" placeholder="10" onChange={(e) => setDiscount(e.target.value)} />
                                                    <InputGroup.Text>%</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Mổ tả ngắn</Form.Label>
                                        <Form.Control as="textarea" rows={3} onChange={(e) => setSummary(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="name">
                                        <Form.Label>Nội dung chính</Form.Label>
                                        <CKEditor value={content} onBlur={handleEditorBlur} />
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
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách Dịch Vụ </h4>
                                </div>
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    slots={{
                                        toolbar: GridToolbar,
                                    }}
                                    slotProps={{
                                        toolbar: {
                                            showQuickFilter: true,
                                            quickFilterProps: {
                                                debounceMs: 500,
                                            },
                                        },
                                    }}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 20,
                                            },
                                        },
                                    }}
                                    onCellEditStop={(params, e) => {
                                        handleCellEditStop(params.row.id, params.field, e.target.value);
                                    }}
                                    onCellEditStart={(params, e) => {
                                        handleCellEditStart(params.row.id, params.field, e.target.value);
                                    }}
                                    pageSizeOptions={[20, 40, 60, 80, 100]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </Col>
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
