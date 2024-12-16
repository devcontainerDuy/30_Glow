import React, { useEffect, useMemo, useState } from "react";
import Body from "@/Layouts/Body";
import { FormControlLabel, Switch } from "@mui/material";
import Layout from "@/Layouts/Index";
import { Button, Row } from "react-bootstrap";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import useDelete from "@/Hooks/useDelete";

function Index({ comment, crumbs, trashs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    const [editingCells, setEditingCells] = useState({});

    const handleCellEditStop = (id, field, value) => {
        const originalValue = editingCells[id + "-" + field];
        if (originalValue !== value) {
            window.axios
                .put("/admin/comments/" + id, {
                    [field]: value,
                })
                .then((res) => {
                    if (res.data.check === true) {
                        toast.success(res.data.message);
                        setData(res.data.data);
                    } else {
                        toast.warning(res.data.message);
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
            toast.info("Không có chỉnh sửa.");
        }
    };
    const { handleDelete, handleRestore, handleDeleteForever, loading: loaded } = useDelete("/admin/comments", setData, setTrash);

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "product",
            headerName: "Sản phẩm/Dịch vụ",
            width: 200,
            renderCell: (params) => {
                const productName = params.row.product ? params.row.product.slug : null;
                const serviceName = params.row.service ? params.row.service.slug : null;
                return productName || serviceName || "Không có dữ liệu";
            },
        },
        {
            field: "comment",
            headerName: "Nội dung",
            width: 220,
        },
        {
            field: "id_customer",
            headerName: "Người gửi",
            width: 180,
            renderCell: (params) => {
                const customerName = params.row.customer ? params.row.customer.name : null;
                const userName = params.row.user ? params.row.user.name : null;
                return customerName || userName || "Không rõ";
            },
        },
        {
            field: "id_parent",
            headerName: "Thuộc",
            width: 80,
            renderCell: (params) => {
                return params.row.id_parent
                    ? `ID: ${params.row.id_parent}`
                    : "Gốc";
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 150,
            renderCell: (params) => new Date(params.row.created_at).toLocaleString(),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 150,
            renderCell: (params) => (
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
                    label={params.row.status ? "Hiện" : "Ẩn"}
                />
            ),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <Button
                        className="ms-2"
                        type="button"
                        variant="outline-danger"
                        title="Xóa sản phẩm"
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
            field: "product",
            headerName: "Sản phẩm/Dịch vụ",
            width: 200,
            renderCell: (params) => {
                const productName = params.row.product ? params.row.product.slug : null;
                const serviceName = params.row.service ? params.row.service.slug : null;
                return productName || serviceName || "Không có dữ liệu";
            },
        },
        {
            field: "comment",
            headerName: "Nội dung",
            width: 220,
        },
        {
            field: "id_customer",
            headerName: "Người gửi",
            width: 180,
            renderCell: (params) => {
                const customerName = params.row.customer ? params.row.customer.name : null;
                const userName = params.row.user ? params.row.user.name : null;
                return customerName || userName || "Không rõ";
            },
        },
        {
            field: "id_parent",
            headerName: "Thuộc",
            width: 80,
            renderCell: (params) => {
                return params.row.id_parent
                    ? `ID: ${params.row.id_parent}`
                    : "Gốc";
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 150,
            renderCell: (params) => new Date(params.row.created_at).toLocaleString(),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 150,
            renderCell: (params) => (
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
                    label={params.row.status ? "Hiện" : "Ẩn"}
                />
            ),
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
        setData(comment);
        setTrash(trashs);
    }, [comment, trashs]);

    return (
        <>
            <Helmet>
                <title>comment </title>
                <meta name="description" content="comment " />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                        </BreadcrumbComponent>
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
