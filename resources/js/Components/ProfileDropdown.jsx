import Dropdown from "react-bootstrap/Dropdown";
import PropTypes from "prop-types";

function ProfileDropdown({ event, show }) {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="link" id="dropdown-basic">
                <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" className="rounded-circle" />
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
                <Dropdown.Item href="#">Cài đặt</Dropdown.Item>
                <Dropdown.Item href="#" role="button" onClick={show}>
                    Thông tin cá nhân
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#" role="button" onClick={event}>
                    Đăng xuất
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ProfileDropdown;

ProfileDropdown.propTypes = {
    event: PropTypes.func,
    show: PropTypes.func,
};
