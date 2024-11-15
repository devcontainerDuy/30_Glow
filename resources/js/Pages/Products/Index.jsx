import React, { useEffect, useMemo, useState } from "react";
import { Box, FormControlLabel, Select, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Layout from "@/Layouts/Index";

import { Button, Col, Form, Image, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { FormControl, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import CKEditor from "@/Containers/CKEditor";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

function Index({ products, crumbs, categories, brands }) {
    const [data, setData] = useState([]);
    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [idCategory, setIdCategory] = useState("");
    const [idBrand, setIdBrand] = useState("");
    const [inStock, setInStock] = useState(0);
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState("");

    const handleClose = () => {
        setShow(false);
        setName("");
        setPrice(0);
        setDiscount(0);
        setIdCategory("");
        setIdBrand("");
        setInStock(0);
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

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("discount", discount);
        formData.append("content", content);
        formData.append("id_category", idCategory);
        formData.append("id_brand", idBrand);
        formData.append("in_stock", inStock);

        files.forEach((file, index) => {
            formData.append(`image[${index}]`, file.file);
        });

        window.axios
            .post("/admin/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
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
                toast.error(error.response.data.message);
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
                .put("/admin/products/" + id, {
                    [field]: value,
                })
                .then((res) => {
                    if (res.data.check) {
                        toast.success(res.data.message);
                        setData(res.data.data);
                        handleClose();
                    } else {
                        toast.warning(res.data.message);
                    }
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
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

    const handleView = (id) => {
        router.visit("/admin/products/" + id + "/edit", {
            method: "get",
        });
    };

    const formatPrice = (params) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(params);
    };

    const columns = useMemo(() => [
        {
            field: "name",
            headerName: "Tên sản phẩm",
            width: 220,
            editable: true,
        },
        {
            field: "price",
            headerName: "Giá",
            width: 120,
            editable: true,
            valueFormatter: formatPrice,
        },
        {
            field: "gallery",
            headerName: "Ảnh sản phẩm",
            width: 120,
            renderCell: (params) => {
                const mainImage = params.row.gallery.find((image) => image.status === 1);

                return <>{mainImage && <Image fluid className="rounded-1 h-100 p-0 m-0" src={"/storage/gallery/" + mainImage.image} alt={mainImage.image} />}</>;
            },
        },

        {
            field: "in_stock",
            headerName: "Số lượng",
            editable: true,
            width: 100,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 160,
            renderCell: (params) => (
                <>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={params.row.status === 1}
                                onChange={() => {
                                    const newStatus = params.row.status === 1 ? 0 : 1;
                                    handleCellEditStop(params.row.id, "status", newStatus);
                                }}
                            />
                        }
                        label={params.row.status ? "Mặc định" : "Không"}
                    />
                </>
            ),
        },
        {
            field: "highlighted",
            headerName: "Nổi bật",
            width: 150,
            renderCell: (params) => (
                <>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={params.row.highlighted === 1}
                                onChange={() => {
                                    const newhigHlighted = params.row.highlighted === 1 ? 0 : 1;
                                    handleCellEditStop(params.row.id, "highlighted", newhigHlighted);
                                }}
                            />
                        }
                        label={params.row.highlighted ? "Hiện" : "Không"}
                    />
                </>
            ),
        },
        {
            field: "id_category",
            headerName: "Danh mục",
            width: 200,
            renderCell: (params) => {
                let categoryId = params.row.id_category || "";
                return (
                    <FormControl fullWidth>
                        <Select
                            id="category-select"
                            value={categoryId}
                            displayEmpty
                            onChange={(e) => {
                                handleCellEditStop(params.row.id, "id_category", e.target.value);
                            }}
                        >
                            <MenuItem value="">Chọn danh mục</MenuItem>
                            {category.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name || "Lỗi"}
                                </MenuItem>
                            ))}
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
                    <Button type="button" variant="outline-info" title="Xem chi tiết sản phẩm" onClick={() => handleView(params.row.id)}>
                        <i className="bi bi-exclamation-circle" />
                    </Button>
                    <Button className="ms-2" type="button" variant="outline-danger" title="Xóa sản phẩm" onClick={() => handleDelete(params.row.id)}>
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);

    const handleEditorBlur = (data) => {
        setContent(data);
    };

    useEffect(() => {
        setData(products);
        setCategory(categories);
        setBrand(brands);
    }, [products, categories, brands]);

    return (
        <>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button type="button" variant="primary" onClick={handleShow}>
                                <i className="bi bi-plus-lg" />
                                <span className="ms-2">Thêm sản phẩm mới</span>
                            </Button>
                        </BreadcrumbComponent>

                        {/* Start Modal */}
                        <Modal show={show} onHide={handleClose} size="lg" centered>
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        <span>Thêm sản phẩm mới</span>
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="overflow-auto" style={{ maxHeight: "calc(100vh - 210px)" }}>
                                    <Row className="row-cols-2">
                                        <Col className="d-flex flex-column">
                                            {/* Tên sản phẩm */}
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Nhập tên sản phẩm</Form.Label>
                                                <Form.Control type="text" placeholder="Tên sản phẩm..." name="name" required onChange={(e) => setName(e.target.value)} />
                                            </Form.Group>
                                            <Row>
                                                <Col>
                                                    <Form.Group className="mb-3" controlId="price">
                                                        <Form.Label>Giá sản phẩm</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control type="number" placeholder="100000" required onChange={(e) => setPrice(e.target.value)} />
                                                            <InputGroup.Text>VND</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={4}>
                                                    {/* Phần trăm giảm */}
                                                    <Form.Group className="mb-3" controlId="discount">
                                                        <Form.Label>Giảm giá</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control type="number" placeholder="10" required onChange={(e) => setDiscount(e.target.value)} />
                                                            <InputGroup.Text>%</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
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

                                    <Row className="row-cols-2">
                                        <Col>
                                            {/* Chọn danh mục */}
                                            <Form.Group className="mb-3" controlId="id_category">
                                                <Form.Label>Chọn danh mục</Form.Label>
                                                <Form.Select name="id_category" required onChange={(e) => setIdCategory(e.target.value)}>
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
                                        </Col>
                                        <Col>
                                            {/* Chọn thương hiệu */}
                                            <Form.Group className="mb-3" controlId="id_brand">
                                                <Form.Label>Chọn thương hiệu</Form.Label>
                                                <Form.Select name="id_brand" required onChange={(e) => setIdBrand(e.target.value)}>
                                                    <option value="">-- Chọn --</option>
                                                    {brand.length > 0 &&
                                                        brand.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Số lượng trong kho */}
                                    <Form.Group className="mb-3" controlId="in_stock">
                                        <Form.Label>Số lượng trong kho</Form.Label>
                                        <Form.Control type="number" placeholder="Số lượng..." required onChange={(e) => setInStock(e.target.value)} />
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
                                                <span className="ms-2">Lưu lại</span>
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
                                    <h4>Danh sách sản phẩm </h4>
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
