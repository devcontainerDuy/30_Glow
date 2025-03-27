import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FormControlLabel, Switch, FormControl, Select, MenuItem } from "@mui/material";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";

function Index({ categories, trashs, crumbs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    const [show, setShow] = useState(false);
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
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

    const { handleSubmit, loading } = useSubmitForm("/admin/categories", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/categories", setData);
    const { handleDelete, handleRestore, handleDeleteForever } = useDelete("/admin/categories", setData, setTrash);

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
                    <div className="d-flex gap-2 align-items-center mt-2">
                        <ButtonsComponent type="button" variant="outline-success" icon="reset" onClick={() => handleRestore(params.row.id)} />
                        <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDeleteForever(params.row.id)} />
                    </div>
                </>
            ),
        },
    ]);

    const tabsData = useMemo(() => [
        {
            eventKey: "list",
            title: "Danh sách",
            data: data,
            columns: columns,
            handleCellEditStop: handleCellEditStop,
            handleCellEditStart: handleCellEditStart,
        },
        {
            eventKey: "trash",
            title: "Thùng rác",
            data: trash,
            columns: columnsTrash,
            handleCellEditStop: handleCellEditStop,
            handleCellEditStart: handleCellEditStart,
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
                            <ButtonsComponent type="button" variant="primary" icon="add" title="Thêm mới" onClick={() => handleShow()} />
                        </BreadcrumbComponent>

                        {/* Start Modal Thêm danh mục mới */}
                        <ModalComponent
                            show={show}
                            close={handleClose}
                            submit={(e) => {
                                e.preventDefault();
                                handleSubmit({ name, id_parent: idParent || null });
                            }}
                            title="Thêm danh mục mới"
                            loaded={loading}
                            body={
                                <>
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
                                </>
                            }
                        />
                        {/* End Modal Thêm danh mục mới */}

                        {/* Start Products Modal */}
                        <ModalComponent
                            show={showProductsModal}
                            close={handleCloseProducts}
                            size="xl"
                            title="Danh sách sản phẩm"
                            body={
                                <>
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
                                </>
                            }
                        />
                        {/* End Products Modal */}

                        {/* Start DataGrid */}
                        <Body title="Danh Sách Danh Mục" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
