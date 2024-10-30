import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/Layouts/Index";
import { Row, Col, Button, Modal, Form, Spinner, Image } from "react-bootstrap";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
    Box,
    FormControl,
    FormControlLabel,
    MenuItem,
    Select,
    Switch,
} from "@mui/material";

import Swal from "sweetalert2";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";

function Index({ galleries, products, crumbs }) {
    const [data, setData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [files, setFiles] = useState([]);
    const [productId, setProductId] = useState("");
    const [status, setStatus] = useState(0);

    const handleClose = () => {
        setShowModal(false);
        setFiles([]);
    };
    const handleShow = () => setShowModal(true);

    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
    };

    const onDelete = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(); // Tạo một đối tượng FormData

        // Kiểm tra nếu có tệp trong files
        if (files.length > 0) {
            files.forEach((file) => {
                formData.append("images[]", file.file); // Thêm tất cả các tệp vào FormData
            });
        } else {
            window.notyf.open({
                type: "error",
                message: "Không có tệp nào để gửi.",
            });
            setLoading(false);
            return;
        }

        formData.append("id_parent", productId); // Thêm id_parent vào FormData
        formData.append("status", status); // Thêm status vào FormData

        window.axios
            .post("/admin/galleries", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.data.check === true) {
                    window.notyf.open({
                        type: "success",
                        message: response.data.msg,
                    });
                    setData(response.data.data);
                    handleClose();
                } else {
                    window.notyf.open({
                        type: "error",
                        message: response.data.msg,
                    });
                }
            })
            .catch((error) => {
                window.notyf.open({
                    type: "error",
                    message: error.response?.data?.msg || "Có lỗi xảy ra!",
                });
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
                .put("/admin/galleries/" + id, {
                    [field]: value,
                })
                .then((res) => {
                    if (res.data.check === true) {
                        window.notyf.open({
                            type: "success",
                            message: res.data.msg,
                        });
                        setData(res.data.data);
                    } else {
                        window.notyf.open({
                            type: "error",
                            message: res.data.msg,
                        });
                    }
                })
                .catch((error) => {
                    window.notyf.open({
                        type: "error",
                        message: error.response.data.msg,
                    });
                });
        } else {
            setEditingCells((prev) => {
                const newEditingCells = { ...prev };
                delete newEditingCells[id + "-" + field];
                return newEditingCells;
            });
            window.notyf.open({
                type: "warning",
                message: "Không chỉnh sửa.",
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Xóa loại tài khoản?",
            text: "Bạn chắc chắn xóa loại tài khoản này!",
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
                        if (res.data.check == true) {
                            window.notyf.open({
                                type: "success",
                                message: res.data.msg,
                            });
                            setData(res.data.data);
                        } else {
                            window.notyf.open({
                                type: "error",
                                message: res.data.msg,
                            });
                        }
                    })
                    .catch((error) => {
                        window.notyf.open({
                            type: "error",
                            message: error.response.data.msg,
                        });
                    });
            }
        });
    };

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "image",
            headerName: "Hình ảnh",
            width: 160,
            renderCell: (params) => {
                return (
                    <>
                        <Image
                            fluid
                            className="rounded-1 h-100 p-0 m-0"
                            src={"/storage/gallery/" + params.value}
                            alt={params.value}
                        />
                    </>
                );
            },
        },
        {
            field: "id_parent",
            headerName: "Sản phẩm",
            width: 360,
            renderCell: (params) => {
                return (
                    <>
                        <FormControl fullWidth>
                            <Select
                                id="category-select"
                                value={params?.value || ""}
                                displayEmpty
                                onChange={(e) => {
                                    handleCellEditStop(
                                        params.row.id,
                                        "id_parent",
                                        e.target.value
                                    );
                                }}
                            >
                                <MenuItem value="">
                                    Chưa sử dụng cho sản phẩm
                                </MenuItem>
                                {productsData &&
                                    productsData?.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </>
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng thái chính",
            width: 220,
            renderCell: (params) => {
                return (
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
                            label={params.row.status ? "Mặc định" : "Không"}
                        />
                    </>
                );
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 220,
            renderCell: (params) => {
                return new Date(params.row.created_at).toLocaleString();
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 180,
            renderCell: (params) => (
                <>
                    <Button
                        type="button"
                        variant="outline-danger"
                        className="ms-2"
                        title="Xóa loại tài khoản"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);

    useEffect(() => {
        setData(galleries);
        setProductsData(products);
    }, [galleries, products]);

    return (
        <>
            <Helmet>
                <title>Bộ sưu tập </title>
                <meta name="description" content="Bộ sưu tập " />
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
                                <i className="bi bi-plus-lg" />
                                <span className="ms-2">
                                    Thêm tài hình ảnh mới
                                </span>
                            </Button>
                        </BreadcrumbComponent>
                        {/* Start Modal */}
                        <Modal show={showModal} onHide={handleClose}>
                            <Form
                                onSubmit={handleSubmit}
                                enctype="multipart/form-data"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        Thêm tài hình ảnh mới
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formBasic"
                                    >
                                        <Form.Label>Hình ảnh</Form.Label>
                                        <Dropzone
                                            onChange={updateFiles}
                                            className="mb-3"
                                            accept="chỉ nhận file (.jpeg, .png, .jpg, .gif)"
                                            value={files}
                                        >
                                            {files &&
                                                files.length > 0 &&
                                                files.map((file, index) => (
                                                    <FileMosaic
                                                        {...file}
                                                        key={index}
                                                        preview
                                                        info
                                                        onDelete={onDelete}
                                                    />
                                                ))}
                                        </Dropzone>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formBasic"
                                    >
                                        <Form.Label>
                                            Danh sách sản phẩm
                                        </Form.Label>
                                        <Form.Select
                                            aria-label="Default select example"
                                            onChange={(e) =>
                                                setProductId(e.target.value)
                                            }
                                        >
                                            <option value="">-- Chọn --</option>
                                            {products.length > 0 ? (
                                                products.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">
                                                    Không có danh mục nào
                                                </option>
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="formBasic"
                                    >
                                        <Form.Label>Trạng thái</Form.Label>
                                        <Form.Select
                                            aria-label="Default select example"
                                            onChange={(e) =>
                                                setStatus(e.target.value)
                                            }
                                        >
                                            <option value="">-- Chọn --</option>
                                            <option value="1">
                                                Hình ảnh mặc định
                                            </option>
                                            <option value="0">
                                                Hình ảnh không mặc định
                                            </option>
                                        </Form.Select>
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={handleClose}
                                    >
                                        <i className="bi bi-box-arrow-right" />
                                        <span className="ms-2">Thoát ra</span>
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
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
                                                    <span>Lưu lại</span>
                                                </span>
                                            </>
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                        {/* End Modal */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Bộ sưu tập </h4>
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
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
