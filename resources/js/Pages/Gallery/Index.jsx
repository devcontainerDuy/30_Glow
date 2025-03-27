import { useEffect, useMemo, useState } from "react";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Row, Button, Modal, Form, Spinner, Image } from "react-bootstrap";
import { FormControl, FormControlLabel, MenuItem, Select, Switch } from "@mui/material";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import { Helmet } from "react-helmet";
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

    const { handleSubmit, loading } = useSubmitForm("/admin/galleries", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/galleries", setData);
    const { handleDelete, handleRestore, handleDeleteForever } = useDelete("/admin/galleries", setData, setTrash);

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "image",
            headerName: "Hình ảnh",
            width: 160,
            renderCell: (params) => {
                return (
                    <>
                        <Image fluid className="rounded-1 h-100 p-0 m-0" src={"/storage/gallery/" + params.value} alt={params.value} />
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
                                    handleCellEditStop(params.row.id, "id_parent", e.target.value);
                                }}
                            >
                                <MenuItem value="">Chưa sử dụng cho sản phẩm</MenuItem>
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
                            control={<Switch checked={params.row.status === 1} onClick={() => handleCellEditStop(params.row.id, "status", params.row.status === 1 ? 0 : 1)} />}
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
                    <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDelete(params.row.id)} />
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
                        <Image fluid className="rounded-1 h-100 p-0 m-0" src={"/storage/gallery/" + params.value} alt={params.value} />
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
                            <Select id="category-select" value={params?.value || ""} displayEmpty disabled>
                                <MenuItem value="">Chưa sử dụng cho sản phẩm</MenuItem>
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
                        <FormControlLabel control={<Switch checked={params.row.status === 1} disabled />} label={params.row.status ? "Mặc định" : "Không"} />
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
        setData(galleries);
        setProductsData(products);
        setTrash(trashs);
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
                            <ButtonsComponent type="button" variant="primary" icon="add" title="Thêm mới" onClick={handleShow} />
                        </BreadcrumbComponent>
                        {/* Start Modal */}
                        <ModalComponent
                            show={showModal}
                            close={handleClose}
                            submit={(e) => {
                                e.preventDefault();
                                handleSubmit({ images: files.map((x) => x.file), id_parent: productId, status: status });
                            }}
                            size="md"
                            title="Thêm bộ sưu tập"
                            loaded={loading}
                            body={
                                <>
                                    <Form.Group className="mb-3" controlId="formBasic">
                                        <Form.Label>Hình ảnh</Form.Label>
                                        <Dropzone onChange={updateFiles} className="mb-3" accept="chỉ nhận file (.jpeg, .png, .jpg, .gif)" value={files}>
                                            {files && files.length > 0 ? (
                                                files.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={onDelete} />)
                                            ) : (
                                                <Form.Label>
                                                    <i className="bi bi-cloud-arrow-up" style={{ fontSize: "5rem" }} />
                                                </Form.Label>
                                            )}
                                        </Dropzone>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasic">
                                        <Form.Label>Danh sách sản phẩm</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => setProductId(e.target.value)}>
                                            <option value="">-- Chọn --</option>
                                            {products.length > 0 ? (
                                                products.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">Không có danh mục nào</option>
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasic">
                                        <Form.Label>Trạng thái</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => setStatus(e.target.value)}>
                                            <option value="">-- Chọn --</option>
                                            <option value={1}>Hình ảnh mặc định</option>
                                            <option value={0}>Hình ảnh không mặc định</option>
                                        </Form.Select>
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}
                        {/* Start DataGrid */}
                        <Body title="Bộ sưu tập" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
