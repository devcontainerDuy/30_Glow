import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/Layouts/Index";
import { Button, Form, Row } from "react-bootstrap";
import { FormControlLabel, Switch } from "@mui/material";
import Body from "@/Layouts/Body";
import { Helmet } from "react-helmet";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";

function Index({ collections, crumbs, trashs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    // const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");

    const handleClose = () => {
        setShow(false);
        setName("");
    };
    const handleShow = () => setShow(true);
    const { handleSubmit, loading } = useSubmitForm("/admin/posts/collections", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/posts/collections", setData);
    const { handleDelete, handleRestore, handleDeleteForever, loading: loaded } = useDelete("/admin/posts/collections", setData, setTrash);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     const requestData = {
    //         name: name,
    //     };
    //     window.axios
    //         .post("/admin/posts/collections", requestData)
    //         .then((response) => {
    //             if (response.data.check === true) {
    //                 toast.success(response.data.message);
    //                 setData(response.data.data);
    //                 handleClose();
    //             } else {
    //                 toast.warning(response.data.message);
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
            headerName: "Tên loại dịch vụ",
            width: 200,
            editable: true,
        },
        {
            field: "slug",
            headerName: "Slug",
            width: 200,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 200,
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
            field: "created_at",
            headerName: "Ngày tạo",
            width: 180,
            renderCell: (params) => {
                return new Date(params.row.created_at).toLocaleString();
            },
        },
        {
            field: "updated_at",
            headerName: "Ngày cập nhật",
            width: 180,
            renderCell: (params) => {
                return new Date(params.row.updated_at).toLocaleString();
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => {
                return (
                    <>
                        <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDelete(params.row.id)} />
                    </>
                );
            },
        },
    ]);
    const columnsTrash = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tên loại dịch vụ",
            width: 200,
            editable: true,
        },
        {
            field: "slug",
            headerName: "Slug",
            width: 200,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 200,
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
            field: "deleted_at",
            headerName: "Ngày xóa",
            width: 220,
            renderCell: (params) => {
                return new Date(params.row.deleted_at).toLocaleString();
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => {
                return (
                    <>
                        <Button type="button" variant="outline-success" title="Khôi phục sản phẩm" onClick={() => handleRestore(params.row.id)}>
                            <i className="bi bi-arrow-clockwise" />
                        </Button>
                        <Button className="ms-2" type="button" variant="outline-danger" title="Xóa vĩnh viễn sản phẩm" onClick={() => handleDeleteForever(params.row.id)}>
                            <i className="bi bi-trash-fill" />
                        </Button>
                    </>
                );
            },
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
        setData(collections);
        setTrash(trashs)
    }, [collections, trashs]);
    return (
        <>
            <Helmet>
                <title>Chuyên đề bài viết</title>
                <meta name="description" content="Chuyên đề bài viết" />
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
                                handleSubmit({ name });
                            }}
                            size="md"
                            title="Thêm mới"
                            loaded={loading}
                            body={
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Loại dịch vụ</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên loại dịch vụ" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}

                        {/* Start DataGrid */}
                        <Body title="Chuyên đề bài viết" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
