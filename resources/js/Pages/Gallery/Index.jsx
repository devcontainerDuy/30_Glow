import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Row, Button, Modal, Form, Spinner, Image } from "react-bootstrap";
import {
    Box,
    FormControl,
    FormControlLabel,
    MenuItem,
    Select,
    Switch,
} from "@mui/material";

import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";

function Index({ galleries, products, crumbs, trashs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    const [productsData, setProductsData] = useState([]);
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
    const { handleSubmit, loading } = useSubmitForm("/admin/galleries", setData, handleClose);
    const { handleCellEditStop } = useEditCell("/admin/galleries", setData);
    const { handleDelete, handleRestore, handleDeleteForever, loading: loaded } = useDelete("/admin/galleries", setData, setTrash);
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
    const columnsTrash = useMemo(() => [
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
            field: "deleted_at",
            headerName: "Ngày xóa",
            width: 220,
            renderCell: (params) => {
                return new Date(params.row.deleted_at).toLocaleString();
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 180,
            renderCell: (params) => (
                <>
                    <Button type="button" variant="outline-success" title="Khôi phục sản phẩm" onClick={() => handleRestore(params.row.id)}>
                        <i className="bi bi-arrow-clockwise" />
                    </Button>
                    <Button className="ms-2" type="button" variant="outline-danger" title="Xóa vĩnh viễn sản phẩm" onClick={() => handleDeleteForever(params.row.id)}>
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
        },
        {
            eventKey: "trash",
            title: "Thùng rác",
            data: trash,
            columns: columnsTrash,
        },
    ]);

    useEffect(() => {
        setData(galleries);
        setProductsData(products);
        setTrash(trashs)
    }, [galleries, products, trashs]);

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
                        {/* Start DataGrid */}
                        <Body title="Danh sách tài khoản" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
