import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const useDelete = (url, setData, setTrash) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Xóa mục?",
            text: "Bạn chắc chắn xóa mục này!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                window.axios
                    .delete(`${url}/${id}`)
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res.data.message);
                            setData(res?.data?.data);
                            setTrash(res?.data?.trashs);
                        }
                    })
                    .catch((error) => {
                        toast.error(error?.response?.data?.message || "Đã xảy ra lỗi!");
                    })
                    .finally(() => setLoading(false));
            }
        });
    };

    const handleRestore = (id) => {
        setLoading(true);
        window.axios
            .post(`${url}/${id}/restore`)
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res?.data?.message);
                    setData(res?.data?.data);
                    setTrash(res?.data?.trashs);
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || "Đã xảy ra lỗi!");
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteForever = (id) => {
        Swal.fire({
            title: "Xóa vĩnh viễn mục?",
            text: "Bạn chắc chắn muốn xóa mục này!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axios
                    .delete(`${url}/${id}/permanent`)
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res?.data?.message);
                            setData(res?.data?.data);
                            setTrash(res?.data?.trashs);
                        } else {
                            toast.warning(res?.data?.message);
                        }
                    })
                    .catch((error) => {
                        toast.error(error?.response?.data?.message || "Đã xảy ra lỗi!");
                    })
                    .finally(() => setLoading(false));
            }
        });
    };

    return { handleDelete, handleRestore, handleDeleteForever, loading };
};

useDelete.propTypes = {
    url: PropTypes.string.isRequired,
    setData: PropTypes.func.isRequired,
    setTrash: PropTypes.func.isRequired,
};

export default useDelete;
