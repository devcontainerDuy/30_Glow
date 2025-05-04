import { useEffect, useMemo, useState } from "react";
import { FormControlLabel, Select, Switch } from "@mui/material";
import Layout from "@/Layouts/Index";
import Body from "@/Layouts/Body";
import { Col, Form, Image, InputGroup, Row } from "react-bootstrap";
import { FormControl, MenuItem } from "@mui/material";
import CKEditor from "@/Containers/CKEditor";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import ButtonsComponent from "@/Components/ButtonsComponent";
import ModalComponent from "@/Components/ModalComponent";
import useSubmitForm from "@/Hooks/useSubmitForm";
import useEditCell from "@/Hooks/useEditCell";
import useDelete from "@/Hooks/useDelete";
import { router } from "@inertiajs/react";
import { Helmet } from "react-helmet";

function Index({ products, trashs, crumbs, categories, brands }) {
    const [data, setData] = useState([]);
    const [trash, setTrash] = useState([]);
    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState([]);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [idCategory, setIdCategory] = useState("");
    const [idBrand, setIdBrand] = useState("");
    const [inStock, setInStock] = useState(0);
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState("");

    const handleClose = () => {
        setShow(false);
        setName("");
        setPrice(0);
        setDiscount(0);
        setIdCategory("");
        setIdBrand("");
        setInStock(0);
        setFiles([]);
        setContent("");
    };

    const handleShow = () => setShow(true);

    const formatPrice = (params) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(params);
    };

    const handleView = (id) => {
        router.visit("/admin/products/" + id + "/edit", {
            method: "get",
        });
    };

    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
    };

    const onDelete = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };

    const handleEditorBlur = (data) => {
        setContent(data);
    };

    const { handleSubmit, loading } = useSubmitForm("/admin/products", setData, setTrash, handleClose);
    const { handleCellEditStart, handleCellEditStop } = useEditCell("/admin/products", setData);
    const { handleDelete, handleRestore, handleDeleteForever } = useDelete("/admin/products", setData, setTrash);

    const columns = useMemo(() => [
        {
            field: "name",
            headerName: "Tên sản phẩm",
            width: 220,
            editable: true,
        },
        {
            field: "price",
            headerName: "Giá",
            width: 120,
            editable: true,
            valueFormatter: formatPrice,
        },
        {
            field: "gallery",
            headerName: "Ảnh sản phẩm",
            width: 120,
            renderCell: (params) => {
                const mainImage = params.row.gallery.find((image) => image.status === 1);

                return <>{mainImage && <Image fluid className="rounded-1 h-100 p-0 m-0" src={"/storage/gallery/" + mainImage.image} alt={mainImage.image} />}</>;
            },
        },

        {
            field: "in_stock",
            headerName: "Số lượng",
            editable: true,
            width: 100,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 160,
            renderCell: (params) => (
                <>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={params.row.status === 1}
                                onChange={() => {
                                    const newStatus = params.row.status === 1 ? 0 : 1;
                                    handleCellEditStop(params.row.id, "status", newStatus);
                                }}
                            />
                        }
                        label={params.row.status ? "Mặc định" : "Không"}
                    />
                </>
            ),
        },
        {
            field: "highlighted",
            headerName: "Nổi bật",
            width: 150,
            renderCell: (params) => (
                <>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={params.row.highlighted === 1}
                                onChange={() => {
                                    const newhigHlighted = params.row.highlighted === 1 ? 0 : 1;
                                    handleCellEditStop(params.row.id, "highlighted", newhigHlighted);
                                }}
                            />
                        }
                        label={params.row.highlighted ? "Hiện" : "Không"}
                    />
                </>
            ),
        },
        {
            field: "id_category",
            headerName: "Danh mục",
            width: 200,
            renderCell: (params) => {
                let categoryId = params.row.id_category || "";
                return (
                    <FormControl fullWidth>
                        <Select
                            id="category-select"
                            value={categoryId}
                            displayEmpty
                            onChange={(e) => {
                                handleCellEditStop(params.row.id, "id_category", e.target.value);
                            }}
                        >
                            <MenuItem value="">Chọn danh mục</MenuItem>
                            {category.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name || "Lỗi"}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <div className="d-flex gap-2 align-items-center mt-2">
                        <ButtonsComponent type="button" variant="outline-info" icon="view" onClick={() => handleView(params.row.id)} />
                        <ButtonsComponent type="button" variant="outline-danger" icon="delete" onClick={() => handleDelete(params.row.id)} />
                    </div>
                </>
            ),
        },
    ]);

    const columnsTrash = useMemo(() => [
        {
            field: "name",
            headerName: "Tên sản phẩm",
            width: 220,
        },
        {
            field: "price",
            headerName: "Giá",
            width: 120,
            valueFormatter: formatPrice,
        },
        {
            field: "gallery",
            headerName: "Ảnh sản phẩm",
            width: 120,
            renderCell: (params) => {
                const mainImage = params.row.gallery.find((image) => image.status === 1);

                return <>{mainImage && <Image fluid className="rounded-1 h-100 p-0 m-0" src={"/storage/gallery/" + mainImage.image} alt={mainImage.image} />}</>;
            },
        },

        {
            field: "in_stock",
            headerName: "Số lượng",
            width: 100,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 160,
            renderCell: (params) => (
                <>
                    <FormControlLabel control={<Switch checked={params.row.status === 1} disabled />} label={params.row.status ? "Mặc định" : "Không"} />
                </>
            ),
        },
        {
            field: "highlighted",
            headerName: "Nổi bật",
            width: 150,
            renderCell: (params) => (
                <>
                    <FormControlLabel control={<Switch checked={params.row.highlighted === 1} disabled />} label={params.row.highlighted ? "Hiện" : "Không"} />
                </>
            ),
        },
        {
            field: "id_category",
            headerName: "Danh mục",
            width: 200,
            renderCell: (params) => {
                let categoryId = params.row.id_category || "";
                return (
                    <FormControl fullWidth>
                        <Select id="category-select" value={categoryId} displayEmpty disabled>
                            <MenuItem value="">Chọn danh mục</MenuItem>
                            {category.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name || "Lỗi"}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            },
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
        setData(products);
        setTrash(trashs);
        setCategory(categories);
        setBrand(brands);
    }, [products, trashs, categories, brands]);

    return (
        <>
            <Helmet>
                <title>Danh sách sản phẩm </title>
                <meta name="description" content="Danh sách sản phẩm " />
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
                                handleSubmit({
                                    name: name,
                                    price: price,
                                    discount: discount,
                                    id_category: idCategory,
                                    id_brand: idBrand,
                                    in_stock: inStock,
                                    image: files.map((f) => f.file),
                                    content: content,
                                });
                            }}
                            size="xl"
                            title="Thêm mới sản phẩm"
                            loaded={loading}
                            body={
                                <>
                                    <Row className="row-cols-2">
                                        <Col className="d-flex flex-column">
                                            {/* Tên sản phẩm */}
                                            <Form.Group className="mb-3" controlId="name">
                                                <Form.Label>Nhập tên sản phẩm</Form.Label>
                                                <Form.Control type="text" placeholder="Tên sản phẩm..." name="name" required onChange={(e) => setName(e.target.value)} />
                                            </Form.Group>
                                            <Row className="row-cols-3">
                                                <Col>
                                                    <Form.Group className="mb-3" controlId="price">
                                                        <Form.Label>Giá sản phẩm</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control type="number" placeholder="100000" min={0} required onChange={(e) => setPrice(e.target.value)} />
                                                            <InputGroup.Text>VND</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    {/* Phần trăm giảm */}
                                                    <Form.Group className="mb-3" controlId="discount">
                                                        <Form.Label>Giảm giá</Form.Label>
                                                        <InputGroup className="mb-3">
                                                            <Form.Control type="number" placeholder="10" min={0} required onChange={(e) => setDiscount(e.target.value)} />
                                                            <InputGroup.Text>%</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    {/* Số lượng trong kho */}
                                                    <Form.Group className="mb-3" controlId="in_stock">
                                                        <Form.Label>Số lượng trong kho</Form.Label>
                                                        <Form.Control type="number" placeholder="Số lượng..." min={0} required onChange={(e) => setInStock(e.target.value)} />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Dropzone onChange={updateFiles} className="mb-3" accept="image/*" value={files}>
                                                {files && files.length > 0 ? (
                                                    files.map((file, index) => <FileMosaic {...file} key={index} preview info onDelete={onDelete} />)
                                                ) : (
                                                    <Form.Label>Ảnh đại diện dịch vụ</Form.Label>
                                                )}
                                            </Dropzone>
                                        </Col>
                                    </Row>

                                    <Row className="row-cols-2">
                                        <Col>
                                            {/* Chọn danh mục */}
                                            <Form.Group className="mb-3" controlId="id_category">
                                                <Form.Label>Chọn danh mục</Form.Label>
                                                <Form.Select name="id_category" required onChange={(e) => setIdCategory(e.target.value)}>
                                                    <option value="">-- Chọn --</option>
                                                    {category.length > 0 ? (
                                                        category.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">Không có danh mục nào</option>
                                                    )}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            {/* Chọn thương hiệu */}
                                            <Form.Group className="mb-3" controlId="id_brand">
                                                <Form.Label>Chọn thương hiệu</Form.Label>
                                                <Form.Select name="id_brand" required onChange={(e) => setIdBrand(e.target.value)}>
                                                    <option value="">-- Chọn --</option>
                                                    {brand.length > 0 &&
                                                        brand.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="note">
                                        <Form.Label>Mô tả sản phẩm</Form.Label>
                                        <CKEditor value={content} onBlur={handleEditorBlur} />
                                    </Form.Group>
                                </>
                            }
                        />
                        {/* End Modal */}

                        {/* Start DataGrid */}
                        <Body title="Danh sách sản phẩm" data={tabsData} />
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
