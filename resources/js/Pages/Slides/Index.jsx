import React, { useEffect, useMemo, useState } from "react";
import { FormControlLabel, Switch } from "@mui/material";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Row, Col, Button, Form, Image } from "react-bootstrap";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Index({ slides, crumbs, trashs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    const [show, setshow] = useState(false);
    const [name, setName] = useState("");
    const [desktop, setDesktop] = useState([]);
    const [mobile, setMobile] = useState([]);
    const [status, setStatus] = useState(0);

    const handleClose = () => {
        setshow(false);
        setName("");
        setDesktop([]);
        setMobile([]);
        setStatus(0);
    };

    const handleShow = () => setshow(true);

    const updateFiles = (files, type) => {
        if (type === "desktop") {
            setDesktop(files);
        } else if (type === "mobile") {
            setMobile(files);
        }
    };

    const onDelete = (file, type) => {
        if (type === "desktop") {
            setDesktop(desktop.filter((f) => f !== file));
        } else if (type === "mobile") {
            setMobile(mobile.filter((f) => f !== file));
        }
    };

    const { handleSubmit, loading } = useSubmitForm("/admin/slides", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/slides", setData);
    const { handleDelete, handleRestore, handleDeleteForever } = useDelete("/admin/slides", setData, setTrash);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     const formData = new FormData();
    //     formData.append("name", name);
    //     formData.append("status", 1);

    //     // Thêm các file desktop vào dưới dạng mảng
    //     desktop.forEach((file) => {
    //         formData.append("desktop[]", file.file); // hoặc file, tùy theo cấu trúc dữ liệu
    //     });

    //     // Thêm các file mobile vào dưới dạng mảng
    //     mobile.forEach((file) => {
    //         formData.append("mobile[]", file.file);
    //     });

    //     window.axios
    //         .post("/admin/slides", formData, {
    //             headers: { "Content-Type": "multipart/form-data" },
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
    //             toast.error(error.response.data.message);
    //         })
    //         .finally(() => setLoading(false));
    // };

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tên",
            width: 180,
            editable: true,
        },
        {
            field: "slug",
            headerName: "Slug",
            width: 140,
        },
        {
            field: "url",
            headerName: "URL",
            width: 160,
        },
        {
            field: "desktop",
            headerName: "Hình ảnh Desktop",
            width: 160,
            renderCell: (params) => {
                const imageUrl = params.value ? "/storage/slides/desktop/" + params.value : "";
                return (
                    <>
                        <Image fluid className="rounded-1 h-100 p-0 m-0" src={imageUrl} alt={params.value || "No Image"} />
                    </>
                );
            },
        },
        {
            field: "mobile",
            headerName: "Hình ảnh Mobile",
            width: 160,
            renderCell: (params) => {
                const imageUrl = params.value ? "/storage/slides/mobile/" + params.value : "";
                return (
                    <>
                        <Image fluid className="rounded-1 h-100 p-0 m-0" src={imageUrl} alt={params.value || "No Image"} />
                    </>
                );
            },
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
                                onChange={() => {
                                    const newStatus = params.row.status === 1 ? 0 : 1; // Lấy trạng thái mới
                                    handleCellEditStop(params.row.id, "status", newStatus); // Gửi dữ liệu đi
                                }}
                            />
                        }
                        label={params.row.status ? "Hoạt động" : "Ẩn"}
                    />
                </>
            ),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <Button type="button" variant="outline-info" title="Xem chi tiết slide">
                        <i className="bi bi-exclamation-circle" />
                    </Button>
                    <Button className="ms-2" type="button" variant="outline-danger" title="Xóa slide" onClick={() => handleDelete(params.row.id)}>
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);

    const columnsTrash = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tên",
            width: 180,
            editable: true,
        },
        {
            field: "slug",
            headerName: "Slug",
            width: 140,
        },
        {
            field: "url",
            headerName: "URL",
            width: 160,
        },
        {
            field: "desktop",
            headerName: "Hình ảnh Desktop",
            width: 160,
            renderCell: (params) => {
                const imageUrl = params.value ? "/storage/slides/desktop/" + params.value : "";
                return (
                    <>
                        <Image fluid className="rounded-1 h-100 p-0 m-0" src={imageUrl} alt={params.value || "No Image"} />
                    </>
                );
            },
        },
        {
            field: "mobile",
            headerName: "Hình ảnh Mobile",
            width: 160,
            renderCell: (params) => {
                const imageUrl = params.value ? "/storage/slides/mobile/" + params.value : "";
                return (
                    <>
                        <Image fluid className="rounded-1 h-100 p-0 m-0" src={imageUrl} alt={params.value || "No Image"} />
                    </>
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 180,
            renderCell: (params) => (
                <>
                    <FormControlLabel control={<Switch checked={params.row.status === 1} disabled />} label={params.row.status ? "Hoạt động" : "Ẩn"} />
                </>
            ),
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

    const tabsData = [
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
    ];

    useEffect(() => {
        setData(slides);
        setTrash(trashs);
    }, [slides, trashs]);

    return (
        <>
            <Helmet>
                <title>Danh sách slides</title>
                <meta name="description" content="Danh sách slides " />
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
                                handleSubmit({ name: name, desktop: desktop.map((f) => f.file), mobile: mobile.map((f) => f.file), status: status });
                            }}
                            size="md"
                            title="Thêm mới"
                            loaded={loading}
                            body={
                                <>
                                    <Form>
                                        <Row className="row-cols-1">
                                            <Col>
                                                {/* Tiêu đề slide */}
                                                <Form.Group className="mb-3" controlId="name">
                                                    <Form.Label>Nhập Tiêu Đề Slide</Form.Label>
                                                    <Form.Control type="text" placeholder="Tiêu đề slide..." name="name" required onChange={(e) => setName(e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                {/* Tiêu đề slide */}
                                                <Form.Group className="mb-3" controlId="status">
                                                    <Form.Label>Trạng thái</Form.Label>
                                                    <Form.Select native value={status} onChange={(e) => setStatus(e.target.value)}>
                                                        <option value={0}>Vô hiệu hóa</option>
                                                        <option value={1}>Hoạt động</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="row-cols-1 row-cols-md-2">
                                            <Col>
                                                <Form.Group className="mb-3" controlId="formBasic">
                                                    <Form.Label>Hình ảnh Desktop</Form.Label>
                                                    <Dropzone
                                                        onChange={(files) => updateFiles(files, "desktop")}
                                                        className="mb-3"
                                                        accept="chỉ nhận file (.jpeg, .png, .jpg, .gif)"
                                                        maxFiles={1}
                                                        value={desktop}
                                                    >
                                                        {desktop &&
                                                            desktop.length > 0 &&
                                                            desktop.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={() => onDelete(file, "desktop")} />)}
                                                    </Dropzone>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3" controlId="formBasic">
                                                    <Form.Label>Hình ảnh Mobile</Form.Label>
                                                    <Dropzone
                                                        onChange={(files) => updateFiles(files, "mobile")}
                                                        className="mb-3"
                                                        accept="chỉ nhận file (.jpeg, .png, .jpg, .gif)"
                                                        maxFiles={1}
                                                        value={mobile}
                                                    >
                                                        {mobile &&
                                                            mobile.length > 0 &&
                                                            mobile.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={() => onDelete(file, "mobile")} />)}
                                                    </Dropzone>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Form>
                                </>
                            }
                        />
                        {/* End Modal */}

                        {/* Start DataGrid */}
                        <Body title="Danh sách slides" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
