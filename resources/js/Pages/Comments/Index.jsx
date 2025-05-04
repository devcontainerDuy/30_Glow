import { useEffect, useMemo, useState } from "react";
import { FormControlLabel, Link, Switch } from "@mui/material";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Row } from "react-bootstrap";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import { Helmet } from "react-helmet";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";

function Index({ comment, crumbs, trashs }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);

    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/comments", setData);
    const { handleDelete, handleRestore, handleDeleteForever } = useDelete("/admin/comments", setData, setTrash);

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 40 },
        {
            field: "product",
            headerName: "Sản phẩm/Dịch vụ",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={`/admin/products/${params.row.id_product}/edit`} target="_blank">
                            {params.row.product ? params.row.product.name : params.row.service ? params.row.service.name : "Không có dữ liệu"}
                        </Link>
                    </>
                );
            },
        },
        {
            field: "comment",
            headerName: "Nội dung",
            width: 280,
        },
        {
            field: "id_customer",
            headerName: "Người gửi",
            width: 180,
            renderCell: (params) => {
                return params.row.customer ? params.row.customer.name : params.row.user ? params.row.user.name : "Không rõ";
            },
        },
        {
            field: "id_parent",
            headerName: "Thuộc",
            width: 80,
            renderCell: (params) => {
                return params.row.id_parent ? `ID: ${params.row.id_parent}` : "Gốc";
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 160,
            renderCell: (params) => new Date(params.row.created_at).toLocaleString(),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 150,
            renderCell: (params) => (
                <FormControlLabel
                    control={<Switch checked={params.row.status === 1} onClick={() => handleCellEditStop(params.row.id, "status", params.row.status === 1 ? 0 : 1)} />}
                    label={params.row.status ? "Hiện" : "Ẩn"}
                />
            ),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 120,
            renderCell: (params) => (
                <>
                    <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDelete(params.row.id)} />
                </>
            ),
        },
    ]);

    const columnsTrash = useMemo(() => [
        { field: "id", headerName: "ID", width: 40 },
        {
            field: "product",
            headerName: "Sản phẩm/Dịch vụ",
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={`/admin/products/${params.row.id_product}/edit`} target="_blank">
                            {params.row.product ? params.row.product.name : params.row.service ? params.row.service.name : "Không có dữ liệu"}
                        </Link>
                    </>
                );
            },
        },
        {
            field: "comment",
            headerName: "Nội dung",
            width: 280,
        },
        {
            field: "id_customer",
            headerName: "Người gửi",
            width: 180,
            renderCell: (params) => {
                return params.row.customer ? params.row.customer.name : params.row.user ? params.row.user.name : "Không rõ";
            },
        },
        {
            field: "id_parent",
            headerName: "Thuộc",
            width: 80,
            renderCell: (params) => {
                return params.row.id_parent ? `ID: ${params.row.id_parent}` : "Gốc";
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 160,
            renderCell: (params) => new Date(params.row.created_at).toLocaleString(),
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 150,
            renderCell: (params) => <FormControlLabel control={<Switch checked={params.row.status === 1} disabled />} label={params.row.status ? "Hiện" : "Ẩn"} />,
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 120,
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
                            <ButtonsComponent type="button" variant="primary" icon="add" title="Thêm mới" disabled={true} onClick={() => console.log("Thêm mới")} />
                        </BreadcrumbComponent>
                        {/* Start DataGrid */}
                        <Body title="Danh sách bình luận" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
