import React, { useEffect, useMemo, useState } from "react";
import Layout from "@layouts/Index";
import Body from "@/Layouts/Body";
import { Form, Row } from "react-bootstrap";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";

function Index({ roles, permissions, crumbs }) {
    const [data, setData] = useState([]);
    const [permissionData, setPermissionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const filterData = (inputValue) => {
        const filtered = permissionData.filter((i) => i.name.toLowerCase().includes(inputValue.toLowerCase()));
        return filtered.map((perm) => ({
            value: perm.id,
            label: perm.name,
        }));
    };

    const loadOptions = async (inputValue) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(filterData(inputValue));
            }, 1000);
        });
    };

    const handleClose = () => {
        setShow(false);
        setName("");
        setSelectedPermissions([]);
        setEditingId({});
    };

    const handleShow = () => setShow(true);

    const handleCloseDetail = () => {
        setShowDetail(false);
        setEditingId({});
        setSelectedPermissions([]);
    };

    const handleShowDetail = (id) => {
        setShowDetail(true);
        window.axios
            .get("/admin/roles/" + id)
            .then((res) => {
                if (res.data.check === true) {
                    setEditingId(res.data.data);
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const { handleSubmit, loading: loaded } = useSubmitForm("/admin/roles", setData, handleClose);
    const { handleCellEditStop, handleCellEditStart } = useEditCell("/admin/roles", setData);
    const { handleDelete } = useDelete("/admin/roles", setData);

    const handleUpdate = (id) => {
        setLoading(true);
        window.axios
            .post("/admin/handleRole/permission/" + id, {
                permissions: selectedPermissions,
            })
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res.data.message);
                    setData(res.data.data);
                    handleCloseDetail();
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            })
            .finally(() => setLoading(false));
    };

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "name",
            headerName: "Tên loại tài khoản",
            width: 200,
            editable: true,
        },
        {
            field: "guard_name",
            headerName: "Quyền truy cập",
            width: 200,
            editable: true,
            type: "singleSelect",
            valueOptions: ["web", "api"],
        },
        {
            field: "permissions",
            headerName: "Quyền truy cập",
            width: 380,
            renderCell: (params) => {
                if (params.row.permissions && params.row.permissions.length > 0) {
                    return params.row.permissions.map((permission, index) => (
                        <span key={index}>
                            {permission.name}
                            {index < params.row.permissions.length - 1 ? ", " : ""}
                        </span>
                    ));
                } else {
                    return "Không có";
                }
            },
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 200,
            renderCell: (params) => {
                return new Date(params.row.created_at).toLocaleString();
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <div className="d-flex gap-2 align-items-center mt-2">
                        <ButtonsComponent type="button" variant="outline-info" icon="view" onClick={() => handleShowDetail(params.row.id)} />
                        <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDelete(params.row.id)} />
                    </div>
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
        setData(roles);
        setPermissionData(permissions);
    }, [roles, permissions]);

    useEffect(() => {
        if (editingId?.permissions) {
            setSelectedPermissions(
                editingId.permissions.map((item) => ({
                    value: item.id,
                    label: item.name,
                }))
            );
        }
    }, [editingId]);

    return (
        <>
            <Layout>
                <Helmet>
                    <title>Danh sách vai trò</title>
                    <meta name="description" content="Danh sách vai trò" />
                </Helmet>
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
                            title="Thêm mới loại tài khoản"
                            loaded={loaded}
                            body={
                                <>
                                    <Form.Group className="mb-3" controlId="formBasic">
                                        <Form.Label>Tên vai trò</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên vai trò" onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}

                        {/* Start DataGrid */}
                        <Body title="Danh sách vai trò" data={tabsData} />
                        {/* End DataGrid */}

                        {/* Start Modal */}
                        <ModalComponent
                            show={showDetail}
                            close={handleCloseDetail}
                            submit={(e) => {
                                e.preventDefault();
                                handleUpdate(editingId?.id);
                            }}
                            size="lg"
                            title="Chi tiết loại tài khoản"
                            loaded={loading}
                            body={
                                <>
                                    <Form.Group className="mb-3" controlId="formBasic1">
                                        <Form.Label>Tên loại tài khoản</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập tên loại tài khoản" defaultValue={editingId?.name} disabled />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasic5">
                                        <Form.Label>Quyền truy cập</Form.Label>
                                        <Form.Control type="text" placeholder="Nhập quyền truy cập" defaultValue={editingId?.guard_name} disabled />
                                    </Form.Group>
                                    <div className="d-flex column-gap-2 justify-content-between">
                                        <Form.Group className="mb-3 w-50" controlId="formBasic2">
                                            <Form.Label>Ngày tạo</Form.Label>
                                            <Form.Control type="text" value={new Date(editingId?.created_at).toLocaleString()} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-3 w-50" controlId="formBasic3">
                                            <Form.Label>Ngày cập nhật</Form.Label>
                                            <Form.Control type="text" value={new Date(editingId?.updated_at).toLocaleString()} disabled />
                                        </Form.Group>
                                    </div>
                                    <Form.Group className="mb-3" controlId="formBasic4">
                                        <Form.Label>Các quyền của loại tài khoản</Form.Label>
                                        {/* Start Select2 */}
                                        <AsyncSelect
                                            name="permissions"
                                            cacheOptions={true}
                                            closeMenuOnSelect={false}
                                            components={makeAnimated()}
                                            isMulti
                                            isSearchable={true}
                                            loadOptions={loadOptions}
                                            value={selectedPermissions}
                                            defaultOptions={permissionData.map((perm) => ({
                                                value: perm.id,
                                                label: perm.name,
                                            }))}
                                            onChange={(newValue) => {
                                                setSelectedPermissions(newValue);
                                                console.log(newValue);
                                            }}
                                            placeholder="Chọn quyền"
                                            noOptionsMessage={() => {
                                                return "Không có quyền";
                                            }}
                                        />
                                        {/* End Select2 */}
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
