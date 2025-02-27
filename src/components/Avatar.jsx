import avatar from "../assets/avatar.png";
import { useMsal } from "@azure/msal-react";

const Avatar = () => {
  const { instance } = useMsal();
  return (
    <li className="nav-item dropdown me-3 ms-2">
      <button
        className="nav-link dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="true"
      >
        <img src={avatar} className="rounded-circle" height="22" alt="User icon" loading="lazy" />
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <button className="dropdown-item" onClick={() => instance.logout()}>
            Logout
          </button>
        </li>
      </ul>
    </li>
  );
};

export default Avatar;
