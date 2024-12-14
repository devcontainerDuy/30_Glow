import { useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const useSubmitForm = (url, setData, setTrash, handleClose) => {
    const [loading, setLoading] = useState(false);

    if (handleClose === undefined) {
        handleClose = () => {};
    }

    const handleSubmit = ({ ...data }) => {
        setLoading(true);
        window.axios
            .post(url, { ...data })
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res?.data?.message);
                    setData(res?.data?.data);
                    setTrash(res?.data?.trashs);
                    handleClose();
                } else {
                    toast.warning(res?.data?.message);
                }
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message);
            })
            .finally(() => setLoading(false));
    };

    return { handleSubmit, loading };
};

useSubmitForm.propTypes = {
    url: PropTypes.string.isRequired,
    setData: PropTypes.func.isRequired,
    setTrash: PropTypes.func,
    handleClose: PropTypes.func,
};

export default useSubmitForm;
