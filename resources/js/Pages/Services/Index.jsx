import React, { useEffect, useMemo, useState } from "react";
import { Box, FormControlLabel, Select, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Button, Col, Form, Image, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import CKEditor from "@/Containers/CKEditor";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

function Index({ services, trashs, collections, crumbs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    const [collected, setCollected] = useState([]);
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

    const handleEditorBlur = (data) => {
        setContent(data);
    };

    const { handleSubmit, loading } = useSubmitForm("/admin/services", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/services", setData);
    const { handleDelete, handleRestore, handleDeleteForever } = useDelete("/admin/services", setData, setTrash);

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
                        <div className="d-flex gap-2 align-content-center mt-2">
                            <ButtonsComponent type="button" variant="outline-info" icon="view" onClick={() => handleView(params.row.id)} />
                            <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDelete(params.row.id)} />
                        </div>
                    </>
                );
            },
        },
    ]);

    const columnsTrash = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tiêu đề dịch vụ",
            width: 220,
        },
        {
            field: "price",
            headerName: "Giá Cơ bản",
            width: 120,
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
                        <FormControlLabel control={<Switch checked={params.row.highlighted === 1} disabled />} label={params.row.highlighted ? "Nổi bật" : "Ẩn"} />
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
                        <FormControlLabel control={<Switch checked={params.row.status === 1} disabled />} label={params.row.status ? "Hoạt động" : "Ẩn"} />
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
                        <div className="d-flex gap-2 align-items-center mt-2">
                            <ButtonsComponent type="button" variant="outline-success" icon="reset" onClick={() => handleRestore(params.row.id)} />
                            <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDeleteForever(params.row.id)} />
                        </div>
                    </>
                );
            },
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
        setData(services);
        setTrash(trashs);
        setCollected(collections);
    }, [services, trashs, collections]);

    return (
        <>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <ButtonsComponent type="button" variant="primary" icon="add" title="Thêm mới" onClick={handleShow} />
                        </BreadcrumbComponent>

                        {/* Start Modal */}
                        <ModalComponent
                            show={show}
                            close={handleClose}
                            submit={(e) => {
                                e.preventDefault();
                                handleSubmit({
                                    name: name,
                                    price: price,
                                    compare_price: comparePrice,
                                    discount: discount,
                                    id_collection: idCollection,
                                    image: files[0].file,
                                    summary: summary,
                                    content: content,
                                });
                            }}
                            size="xl"
                            title="Thêm dịch vụ"
                            loaded={loading}
                            body={
                                <>
                                    <Row>
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
                                        <Col xs={4}>
                                            <Form.Group className="mb-3" controlId="image">
                                                <Form.Label>Chọn hình anh dịch vụ</Form.Label>
                                                <Dropzone onChange={updateFiles} className="rounded-1 mb-3" accept="image/*" maxFiles={1} multiple={false} value={files}>
                                                    {files && files.length > 0 ? (
                                                        files.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={onDelete} />)
                                                    ) : (
                                                        <Form.Label>
                                                            <i className="bi bi-cloud-arrow-up" style={{ fontSize: "5rem" }} />
                                                        </Form.Label>
                                                    )}
                                                </Dropzone>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="row-cols-3">
                                        <Col>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Giá gốc</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control type="number" min={0} placeholder="100000" onChange={(e) => setComparePrice(e.target.value)} />
                                                    <InputGroup.Text>VND</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Giá cơ bản</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control type="number" min={0} placeholder="80000" onChange={(e) => setPrice(e.target.value)} />
                                                    <InputGroup.Text>VND</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Phần trăm giảm</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control type="number" min={0} placeholder="10" onChange={(e) => setDiscount(e.target.value)} />
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
                                </>
                            }
                        />
                        {/* End Modal */}

                        {/* Start DataGrid */}
                        <Body title="Danh sách dịch vụ" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
