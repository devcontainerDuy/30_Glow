import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Row, Form } from "react-bootstrap";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import { Helmet } from "react-helmet";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";

function Index({ permissions, crumbs }) {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");

    const handleClose = () => {
        setShowModal(false);
        setName("");
    };

    const handleShow = () => setShowModal(true);

    const { handleSubmit, loading } = useSubmitForm("/admin/permissions", setData, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/permissions", setData);
    const { handleDelete } = useDelete("/admin/permissions", setData);

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tên loại tài khoản",
            width: 250,
            editable: true,
        },
        {
            field: "guard_name",
            headerName: "Quyền truy cập",
            width: 250,
            editable: true,
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
            field: "updated_at",
            headerName: "Ngày thay đổi",
            width: 220,
            renderCell: (params) => {
                return new Date(params.row.updated_at).toLocaleString();
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

    const tabsData = useMemo(() => [
        {
            eventKey: "roles",
            title: "Danh sách",
            data: data,
            columns: columns,
            handleCellEditStop: handleCellEditStop,
            handleCellEditStart: handleCellEditStart,
        },
    ]);

    useEffect(() => {
        setData(permissions);
    }, [permissions]);

    return (
        <>
            <Helmet>
                <title>Danh sách quyền </title>
                <meta name="description" content="Danh sách quyền " />
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
                                handleSubmit({ name: name });
                            }}
                            size="md"
                            title="Thêm mới"
                            loaded={loading}
                            body={
                                <>
                                    <Form.Group className="mb-3" controlId="formName">
                                        <Form.Label>Tên quyền</Form.Label>
                                        <Form.Control type="text" placeholder="Tên quyền" value={name} onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}

                        <Body title="Danh sách quyền" data={tabsData} />
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
