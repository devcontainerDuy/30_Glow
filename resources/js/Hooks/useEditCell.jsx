import { useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const useEditCell = (url, setData) => {
    const [editingCells, setEditingCells] = useState({});

    const handleCellEditStart = (id, field, value) => {
        setEditingCells((prev) => ({ ...prev, [id + "-" + field]: value }));
    };

    const handleCellEditStop = (id, field, value) => {
        const originalValue = editingCells[id + "-" + field];

        if (originalValue !== value) {
            window.axios
                .put(`${url}/${id}`, { [field]: value })
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
            toast.info("Không có chỉnh sửa.");
        }
    };

    return { handleCellEditStart, handleCellEditStop, editingCells };
};

useEditCell.propTypes = {
    url: PropTypes.string.isRequired,
    setData: PropTypes.func.isRequired,
};

export default useEditCell;
