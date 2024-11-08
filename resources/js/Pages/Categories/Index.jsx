import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/Layouts/Index";
import { Button, Card, Col, Form, Row, Modal, Spinner } from "react-bootstrap";
import {
    Box,
    FormControlLabel,
    Switch,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";

function Index({ categories, products, crumbs }) {
    const [data, setData] = useState([]);
    const [productList, setProductList] = useState([]);
    const [show, setShow] = useState(false);
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingCells, setEditingCells] = useState({});
    const [name, setName] = useState("");
    const [idParent, setIdParent] = useState("");
    const [categoryId, setCategoryId] = useState(null);

    const handleClose = () => {
        setShow(false);
        setName("");
        setIdParent("");
    };
    // console.log(categories.products);
    const handleShow = () => setShow(true);
    const handleShowProducts = (categoryId) => {
        setCategoryId(categoryId);
        const filteredProducts = productList.filter(product => product.id_category === categoryId);
        setSelectedProducts(filteredProducts);
        setShowProductsModal(true);
    };
    const handleCloseProducts = (categoryId) => {
        setShowProductsModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        window.axios
            .post("/admin/categories", {
                name: name,
                id_parent: idParent || null,
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
            })
            .finally(() => setLoading(false));
    };

    const handleCellEditStart = (id, field, value) => {
        setEditingCells((prev) => ({ ...prev, [id + "-" + field]: value }));
    };

    const handleCellEditStop = (id, field, value) => {
        if (field === "id_parent") {
            const childCategories = data.filter(
                (category) => category.id_parent === id
            );
            if (childCategories.length > 0) {
                Swal.fire({
                    title: "Cập nhật các danh mục con?",
                    text: "Danh mục này có các danh mục con. Bạn có muốn cập nhật các danh mục con của nó không?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Có, cập nhật",
                    cancelButtonText: "Hủy",
                }).then((result) => {
                    if (result.isConfirmed) {
                        childCategories.forEach((childCategory) => {
                            window.axios
                                .put(`/admin/categories/${childCategory.id}`, {
                                    id_parent: value,
                                })
                                .then((res) => {
                                    if (res.data.check === true) {
                                        toast.success(res.data.message);
                                        setData(res.data.data);
                                    }
                                })
                                .catch((error) => {
                                    toast.error(error.response.data.message);
                                });
                        });
                    }
                });
            }
        }
        const originalValue = editingCells[id + "-" + field];
        if (originalValue !== value) {
            window.axios
                .put("/admin/categories/" + id, {
                    [field]: value,
                })
                .then((res) => {
                    if (res.data.check === true) {
                        toast.success(res.data.message);
                        setData(res.data.data);
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
            toast.info("Không có chỉnh sửa.");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Xóa danh mục?",
            text: "Bạn chắc chắn xóa danh mục này!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                window.axios
                    .delete(`/admin/categories/${id}`)
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res.data.message);
                            setData((prevData) =>
                                prevData.filter(
                                    (category) => category.id !== id
                                )
                            );
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

    const handleDeleteProduct = (id) => {
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
                    .delete("/admin/products/" + id)
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res.data.message);    
                            const filteredProducts = res.data.data.filter(product => product.id_category === categoryId);
                            setSelectedProducts(filteredProducts);
                            setData(res.data.categories);
                            setProductList(res.data.data)
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

    const handleUpdateProduct = (id, newCategoryId) => {
        const updatedData = {
            id_category: newCategoryId,
        };
    
        window.axios
            .put(`/admin/products/${id}`, updatedData)
            .then((res) => {
                if (res.data.check) {
                    toast.success(res.data.message);    
                    const filteredProducts = res.data.data.filter(product => product.id_category === categoryId);
                    setSelectedProducts(filteredProducts);
                    setData(res.data.categories);
                    setProductList(res.data.data)
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tên danh mục",
            width: 240,
            editable: true,
        },
        {
            field: "slug",
            headerName: "Slug",
            width: 180,
        },
        {
            field: "products_count",
            headerName: "Số lượng sản phẩm",
            width: 180,
            renderCell: (params) => (
                <Button
                    variant="link"
                    onClick={() => handleShowProducts(params.row.id)}
                >
                    {params.row.products_count}
                </Button>
            ),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 180,
            renderCell: (params) => (
                <>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={params.row.status === 1}
                                onClick={() =>
                                    handleCellEditStop(
                                        params.row.id,
                                        "status",
                                        params.row.status === 1 ? 0 : 1
                                    )
                                }
                            />
                        }
                        label={params.row.status ? "Hoạt động" : "Ẩn"}
                    />
                </>
            ),
        },
        {
            field: "id_parent",
            headerName: "Danh mục cha",
            width: 200,
            renderCell: (params) => {
                let parentId = params.row.id_parent || "";

                return (
                    <>
                        <FormControl fullWidth>
                            <Select
                                id="parent-select"
                                value={parentId}
                                displayEmpty
                                onChange={(e) => {
                                    handleCellEditStop(
                                        params.row.id,
                                        "id_parent",
                                        e.target.value
                                    );
                                }}
                            >
                                <MenuItem value="">Danh mục cha</MenuItem>
                                {data
                                    .filter(
                                        (category) =>
                                            category.id_parent === null
                                    )
                                    .map((category, index) => (
                                        <MenuItem
                                            key={index}
                                            value={category.id}
                                            disabled={
                                                category.id === params.row.id
                                            }
                                        >
                                            {category.name || "Lỗi"}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </>
                );
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 180,
            renderCell: (params) =>
                new Date(params.row.created_at).toLocaleString(),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <Button
                    type="button"
                    variant="outline-danger"
                    className="ms-2"
                    title="Xóa danh mục"
                    onClick={() => handleDelete(params.row.id)}
                >
                    <i className="bi bi-trash-fill" />
                </Button>
            ),
        },
    ]);

    console.log();

    useEffect(() => {
        setData(categories);
        setProductList(products)
    }, [categories, products]);

    return (
        <>
            <Helmet>
                <title>Danh sách danh mục</title>
                <meta name="description" content="Danh sách danh mục" />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleShow}
                            >
                                <i className="bi bi-plus-circle" />
                                <span className="ms-2">Thêm danh mục mới</span>
                            </Button>
                        </BreadcrumbComponent>

                        {/* Start Modal Thêm danh mục mới */}
                        <Modal show={show} onHide={handleClose}>
                            <Form onSubmit={handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        Thêm danh mục sản phẩm mới
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="name"
                                    >
                                        <Form.Label>
                                            Tên danh mục sản phẩm
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên danh mục sản phẩm"
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="parentSelect"
                                        className="mt-3"
                                    >
                                        <Form.Label>
                                            Chọn danh mục cha (nếu có)
                                        </Form.Label>
                                        <Form.Select
                                            onChange={(e) =>
                                                setIdParent(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                Không có danh mục cha
                                            </option>
                                            {data
                                                .filter(
                                                    (category) =>
                                                        category.id_parent ===
                                                        null
                                                )
                                                .map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name || "Lỗi"}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={handleClose}
                                    >
                                        Đóng
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Spinner
                                                animation="border"
                                                size="sm"
                                            />
                                        ) : (
                                            "Lưu danh mục"
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                        {/* End Modal Thêm danh mục mới */}

                        {/* Start Products Modal */}
                        <Modal show={showProductsModal} onHide={() => setShowProductsModal(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Danh Sách Sản Phẩm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row className="row-cols-4 g-1">
                                    {selectedProducts.length > 0 ? (
                                        selectedProducts.map((item, index) => (
                                            <Col key={index} className="mb-3">
                                                <Card style={{ minHeight: "246px" }}>
                                                    <div className="d-flex flex-column align-items-center">
                                                        {item.gallery && item.gallery.length > 0 && item.gallery.find((image) => image.status === 1) && (
                                                            <Card.Img
                                                                variant="top"
                                                                fluid
                                                                className="mb-1 rounded-1 w-100"
                                                                style={{ maxHeight: "182.75px" }}
                                                                src={`/storage/gallery/${item.gallery.find((image) => image.status === 1).image}`}
                                                                alt={item.name}
                                                            />
                                                        )}
                                                        <span className="mt-2">{item.name}</span>
                                                    </div>
                                                    <Card.Body className="p-2 d-flex justify-content-between align-items-center">
                                                        <select
                                                            className="form-select w-75"
                                                            defaultValue={item.id_category}
                                                            onChange={(e) => handleUpdateProduct(item.id, e.target.value)} // Gọi hàm cập nhật khi chọn
                                                        >
                                                            {categories.map((category) => (
                                                                <option key={category.id} value={category.id}>
                                                                    {category.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="d-flex">
                                                            <Button
                                                                className="me-2"
                                                                variant="danger"
                                                                type="button"
                                                                onClick={() => handleDeleteProduct(item.id)}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <p>Không có sản phẩm nào trong danh mục này.</p>
                                    )}
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => handleCloseProducts()}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        {/* End Products Modal */}

                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Danh Sách Danh Mục</h4>
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
                                        handleCellEditStop(
                                            params.row.id,
                                            params.field,
                                            e.target.value
                                        );
                                    }}
                                    onCellEditStart={(params, e) => {
                                        handleCellEditStart(
                                            params.row.id,
                                            params.field,
                                            e.target.value
                                        );
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
