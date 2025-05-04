import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Button, Card, Col, Form, Row, Modal, Spinner, Tab, Tabs } from "react-bootstrap";
import { Box, FormControlLabel, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Index({ brands, trashs, crumbs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [idBrand, setIdBrand] = useState(null);

    const truncateStyle = {
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        minHeight: "48px",
    };

    const handleClose = () => {
        setShow(false);
        setName("");
    };

    const handleShow = () => setShow(true);

    const handleShowProducts = (idBrand) => {
        setIdBrand(idBrand);
        const brand = data.find((cat) => cat.id === idBrand);
        if (brand && brand.products) {
            setSelectedProducts(brand.products);
            console.log(brand.products);
            setShowProductsModal(true);
        } else {
            setSelectedProducts([]);
        }
    };

    const handleCloseProducts = () => {
        setShowProductsModal(false);
        setSelectedProducts([]);
    };

    const { handleSubmit, loading } = useSubmitForm("/admin/brands", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/brands", setData);
    const { handleDelete, handleRestore, handleDeletePermanent } = useDelete("/admin/brands", setData, setTrash);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     window.axios
    //         .post("/admin/brands", {
    //             name: name,
    //         })
    //         .then((res) => {
    //             if (res.data.check === true) {
    //                 toast.success(res.data.message);
    //                 setData(res.data.data);
    //                 handleClose();
    //             } else {
    //                 toast.warning(res.data.message);
    //             }
    //         })
    //         .catch((error) => {
    //             window.notyf.open({
    //                 type: "error",
    //                 message: error.response.data.msg,
    //             });
    //         })
    //         .finally(() => setLoading(false));
    // };

    // const handleCellEditStart = (id, field, value) => {
    //     setEditingCells((prev) => ({ ...prev, [id + "-" + field]: value }));
    // };

    // const handleCellEditStop = (id, field, value) => {
    //     const originalValue = editingCells[id + "-" + field];
    //     if (originalValue !== value) {
    //         window.axios
    //             .put("/admin/brands/" + id, {
    //                 [field]: value,
    //             })
    //             .then((res) => {
    //                 if (res.data.check === true) {
    //                     toast.success(res.data.message);
    //                     setData(res.data.data);
    //                 } else {
    //                     toast.warning(res.data.message);
    //                 }
    //             })
    //             .catch((error) => {
    //                 window.notyf.open({
    //                     type: "error",
    //                     message: error.response.data.msg,
    //                 });
    //             });
    //     } else {
    //         setEditingCells((prev) => {
    //             const newEditingCells = { ...prev };
    //             delete newEditingCells[id + "-" + field];
    //             return newEditingCells;
    //         });
    //         toast.info("Không có chỉnh sửa.");
    //     }
    // };

    // const handleDelete = (id) => {
    //     Swal.fire({
    //         title: "Xóa danh mục?",
    //         text: "Bạn chắc chắn xóa danh mục này!",
    //         icon: "error",
    //         showCancelButton: true,
    //         confirmButtonColor: "#3085d6",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Có, xóa",
    //         cancelButtonText: "Hủy",
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             window.axios
    //                 .delete(`/admin/brands/${id}`)
    //                 .then((res) => {
    //                     if (res.data.check === true) {
    //                         toast.success(res.data.message);
    //                         setData((prevData) => prevData.filter((category) => category.id !== id));
    //                         setTrash(res.data.trashs);
    //                     } else {
    //                         toast.warning(res.data.message);
    //                     }
    //                 })
    //                 .catch((error) => {
    //                     toast.error(error.response.data.message);
    //                 });
    //         }
    //     });
    // };

    // const handleRestore = (id) => {
    //     window.axios
    //         .post("/admin/brands/" + id + "/restore")
    //         .then((res) => {
    //             if (res.data.check === true) {
    //                 toast.success(res.data.message);
    //                 setData(res.data.data);
    //                 setTrash(res.data.trashs);
    //             } else {
    //                 toast.warning(res.data.message);
    //             }
    //         })
    //         .catch((error) => {
    //             toast.error(error.response.data.message);
    //         });
    // };

    // const handleDeletePermanent = (id) => {
    //     window.axios
    //         .delete("/admin/brands/" + id + "/permanent")
    //         .then((res) => {
    //             if (res.data.check === true) {
    //                 toast.success(res.data.message);
    //                 setData(res.data.data);
    //                 setTrash(res.data.trashs);
    //             } else {
    //                 toast.warning(res.data.message);
    //             }
    //         })
    //         .catch((error) => {
    //             toast.error(error.response.data.message);
    //         });
    // };

    const handleUpdateProduct = (id, newIdBrand) => {
        const updatedData = {
            id_brand: newIdBrand,
        };

        window.axios
            .put(`/admin/products/${id}`, updatedData)
            .then((res) => {
                if (res.data.check) {
                    toast.success(res.data.message);
                    const filteredProducts = res.data.data.filter((product) => product.id_brand === idBrand);
                    setSelectedProducts(filteredProducts);
                    setData(res.data.brands);
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
            headerName: "Tên thương hiệu",
            width: 200,
            editable: true,
        },
        {
            field: "slug",
            headerName: "Slug",
            width: 200,
            editable: false,
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
            field: "created_at",
            headerName: "Ngày tạo",
            width: 200,
            renderCell: (params) => new Date(params.row.created_at).toLocaleString(),
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
            headerName: "Tên thương hiệu",
            width: 200,
            editable: true,
        },
        {
            field: "slug",
            headerName: "Slug",
            width: 200,
            editable: false,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 160,
            renderCell: (params) => (
                <>
                    <FormControlLabel control={<Switch checked={params.row.status === 1} disabled />} label={params.row.status ? "Hoạt động" : "Không"} />
                </>
            ),
        },
        {
            field: "deleted_at",
            headerName: "Ngày xóa",
            width: 200,
            renderCell: (params) => new Date(params.row.deleted_at).toLocaleString(),
        },
        {
            field: "updated_at",
            headerName: "Ngày cập nhật",
            width: 200,
            renderCell: (params) => new Date(params.row.updated_at).toLocaleString(),
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
        setData(brands);
        setTrash(trashs);
    }, [brands, trashs]);

    return (
        <>
            <Helmet>
                <title>Danh sách thương hiệu</title>
                <meta name="description" content="Danh sách thương hiệu" />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <ButtonsComponent type="button" variant="primary" icon="add" title="Thêm mới" onClick={handleShow} />
                        </BreadcrumbComponent>

                        {/* Start Modal */}
                        <ModalComponent
                            show={show}
                            close={handleClose}
                            submit={(e) => {
                                e.preventDefault();
                                handleSubmit({ name: name });
                            }}
                            size="md"
                            title="Thêm thương hiệu"
                            loaded={loading}
                            body={
                                <>
                                    <Form.Group className="mb-3" controlId="name">
                                        <Form.Label>Tên Thương hiệu</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên thương hiệu" onChange={(e) => setName(e.target.value)} required />
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}
                        <ModalComponent
                            show={showProductsModal}
                            close={handleCloseProducts}
                            size="xl"
                            title="Danh Sách Sản Phẩm"
                            body={
                                <>
                                    <Row className="row-cols-4 g-1">
                                        {selectedProducts.length > 0 ? (
                                            selectedProducts.map((item, index) => (
                                                <Col key={index} className="mb-3">
                                                    <Card style={{ minHeight: "331.5px" }}>
                                                        <div className="d-flex flex-column align-items-center">
                                                            {item.gallery && item.gallery.length > 0 && item.gallery.find((image) => image.status === 1) && (
                                                                <Card.Img
                                                                    variant="top"
                                                                    fluid
                                                                    className="mb-1 rounded-1 w-100"
                                                                    style={{ objectFit: "cover", minHeight: "271.5px" }}
                                                                    src={`/storage/gallery/${item.gallery.find((image) => image.status === 1).image}`}
                                                                    alt={item.gallery.find((image) => image.status === 1).image}
                                                                />
                                                            )}
                                                        </div>
                                                        <Card.Body className="p-2 d-flex justify-content-between align-items-center">
                                                            <div className="d-flex flex-column w-100">
                                                                <Card.Text className="mb-0">
                                                                    <span className="mt-2" style={truncateStyle}>
                                                                        {item.name}
                                                                    </span>
                                                                </Card.Text>
                                                                <select
                                                                    className="form-select"
                                                                    value={item.id_brand} // sử dụng value thay vì defaultValue
                                                                    onChange={(e) => handleUpdateProduct(item.id, e.target.value)}
                                                                >
                                                                    {brands.map((brand) => (
                                                                        <option key={brand.id} value={brand.id}>
                                                                            {brand.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))
                                        ) : (
                                            <p>Không có sản phẩm nào thuộc thương hiệu này.</p>
                                        )}
                                    </Row>
                                </>
                            }
                            footer={
                                <>
                                    <ButtonsComponent type="button" variant="secondary" icon="close" title="Thoát ra" onClick={handleCloseProducts} />
                                </>
                            }
                        />

                        <Body title="Danh sách thương hiệu" data={tabsData} />
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
