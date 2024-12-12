import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/Layouts/Index";
import { Button, Card, Col, Form, Row, Modal, Spinner, Tab, Tabs } from "react-bootstrap";
import { FormControlLabel, Switch, FormControl, Select, MenuItem } from "@mui/material";
import TableDataGrid from "@components/TableDataGrid";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";

function Index({ categories, trashs, crumbs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    const [show, setShow] = useState(false);
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingCells, setEditingCells] = useState({});
    const [name, setName] = useState("");
    const [idParent, setIdParent] = useState("");
    const [categoryId, setCategoryId] = useState(null);

    const truncateStyle = {
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
    };

    const handleClose = () => {
        setShow(false);
        setName("");
        setIdParent("");
    };
    const handleShow = () => setShow(true);

    const handleShowProducts = (categoryId) => {
        setCategoryId(categoryId);
        const category = data.find((cat) => cat.id === categoryId);
        if (category && category.products) {
            setSelectedProducts(category.products);
        } else {
            setSelectedProducts([]);
        }
        setShowProductsModal(true);
    };
    const handleCloseProducts = () => {
        setShowProductsModal(false);
        setSelectedProducts([]);
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
            const childCategories = data.filter((category) => category.id_parent === id);
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
                            setData((prevData) => prevData.filter((category) => category.id !== id));
                            setTrash(res.data.trashs);
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

    const handleRestore = (id) => {
        window.axios
            .post("/admin/categories/" + id + "/restore")
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res.data.message);
                    setData(res.data.data);
                    setTrash(res.data.trashs);
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const handleDeletePermanent = (id) => {
        Swal.fire({
            title: "Xóa vĩnh viễn mục?",
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
                    .delete("/admin/categories/" + id + "/permanent")
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res.data.message);
                            setData(res.data.data);
                            setTrash(res.data.trashs);
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
                    const filteredProducts = res.data.data.filter((product) => product.id_category === categoryId);
                    setSelectedProducts(filteredProducts);
                    setData(res.data.categories);
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
                <Button variant="link" onClick={() => handleShowProducts(params.row.id)}>
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
                        control={<Switch checked={params.row.status === 1} onClick={() => handleCellEditStop(params.row.id, "status", params.row.status === 1 ? 0 : 1)} />}
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
                                    handleCellEditStop(params.row.id, "id_parent", e.target.value);
                                }}
                            >
                                <MenuItem value="">Danh mục cha</MenuItem>
                                {data
                                    .filter((category) => category.id_parent === null)
                                    .map((category, index) => (
                                        <MenuItem key={index} value={category.id} disabled={category.id === params.row.id}>
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
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <Button type="button" variant="outline-danger" className="ms-2" title="Xóa danh mục" onClick={() => handleDelete(params.row.id)}>
                    <i className="bi bi-trash-fill" />
                </Button>
            ),
        },
    ]);

    const columnsTrash = useMemo(() => [
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
                <Button variant="link" onClick={() => handleShowProducts(params.row.id)}>
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
                    <FormControlLabel control={<Switch checked={params.row.status === 1} />} label={params.row.status ? "Hoạt động" : "Ẩn"} disabled />
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
                            <Select id="parent-select" value={parentId} displayEmpty disabled>
                                <MenuItem value="">Danh mục cha</MenuItem>
                                {data
                                    .filter((category) => category.id_parent === null)
                                    .map((category, index) => (
                                        <MenuItem key={index} value={category.id} disabled={category.id === params.row.id}>
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
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <Button type="button" variant="outline-success" title="Khôi phục sản phẩm" onClick={() => handleRestore(params.row.id)}>
                        <i className="bi bi-arrow-clockwise" />
                    </Button>
                    <Button className="ms-2" type="button" variant="outline-danger" title="Xóa vĩnh viễn sản phẩm" onClick={() => handleDeletePermanent(params.row.id)}>
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);

    useEffect(() => {
        setData(categories);
        setTrash(trashs);
    }, [categories, trashs]);

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
                            <Button type="button" variant="primary" onClick={handleShow}>
                                <i className="bi bi-plus-circle" />
                                <span className="ms-2">Thêm danh mục mới</span>
                            </Button>
                        </BreadcrumbComponent>

                        {/* Start Modal Thêm danh mục mới */}
                        <Modal show={show} onHide={handleClose}>
                            <Form onSubmit={handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Thêm danh mục sản phẩm mới</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group className="mb-3" controlId="name">
                                        <Form.Label>Tên danh mục sản phẩm</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên danh mục sản phẩm" onChange={(e) => setName(e.target.value)} required />
                                    </Form.Group>
                                    <Form.Group controlId="parentSelect" className="mt-3">
                                        <Form.Label>Chọn danh mục cha (nếu có)</Form.Label>
                                        <Form.Select onChange={(e) => setIdParent(e.target.value)}>
                                            <option value="">Không có danh mục cha</option>
                                            {data
                                                .filter((category) => category.id_parent === null)
                                                .map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name || "Lỗi"}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Đóng
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? <Spinner animation="border" size="sm" /> : "Lưu danh mục"}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                        {/* End Modal Thêm danh mục mới */}

                        {/* Start Products Modal */}
                        <Modal show={showProductsModal} onHide={handleCloseProducts} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Danh Sách Sản Phẩm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row className="row-cols-4 g-1">
                                    {selectedProducts.length > 0 ? (
                                        selectedProducts.map((item, index) => (
                                            <Col key={index} className="mb-3">
                                                <Card>
                                                    {item.gallery && item.gallery.length > 0 && item.gallery.find((image) => image.status === 1) ? (
                                                        <>
                                                            <Card.Img
                                                                variant="top"
                                                                fluid
                                                                className="mb-1 rounded-1"
                                                                src={`/storage/gallery/${item.gallery.find((image) => image.status === 1).image}`}
                                                                alt={item.gallery.find((image) => image.status === 1).image}
                                                            />
                                                        </>
                                                    ) : (
                                                        <Card.Img
                                                            variant="top"
                                                            fluid
                                                            className="mb-1 rounded-1"
                                                            src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500"
                                                            alt="No image"
                                                        />
                                                    )}
                                                    <Card.Body className="d-flex flex-wrap">
                                                        <p className="my-2 text-break" style={truncateStyle}>
                                                            {item.name}
                                                        </p>
                                                        <select className="form-select" value={item.id_category} onChange={(e) => handleUpdateProduct(item.id, e.target.value)}>
                                                            {categories.map((category) => (
                                                                <option key={category.id} value={category.id}>
                                                                    {category.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <>
                                            <Col xs="12">
                                                <p className="text-center">Không có sản phẩm nào trong danh mục này.</p>
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseProducts}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        {/* End Products Modal */}

                        <Col xs="12">
                            <div className="text-start my-2">
                                <h4>Danh Sách Danh Mục</h4>
                            </div>
                        </Col>

                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Tabs defaultActiveKey="list" id="uncontrolled-tab-example">
                                <Tab eventKey="list" title={"Danh sách" + " (" + data.length + ")"}>
                                    <TableDataGrid data={data} columns={columns} handleCellEditStop={handleCellEditStop} handleCellEditStart={handleCellEditStart} />
                                </Tab>
                                <Tab eventKey="trash" title={"Thùng rác" + " (" + trash.length + ")"}>
                                    <TableDataGrid data={trash} columns={columnsTrash} handleCellEditStop={handleCellEditStop} handleCellEditStart={handleCellEditStart} />
                                </Tab>
                            </Tabs>
                        </Col>
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
