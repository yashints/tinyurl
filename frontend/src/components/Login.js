import { useMsal } from "@azure/msal-react";
import login from "../assets/login.png";

const Login = () => {
  const { instance, inProgress } = useMsal();

  const initializeSignIn = () => {
    const accounts = instance.getAllAccounts();
    if (accounts.length === 0 && inProgress !== "login") {
      instance.loginPopup();
    }
  };

  return (
    <>
      <li className="nav-item me-2">
        <button
          title="login"
          type="button"
          onClick={initializeSignIn}
          className="btn rounded-circle btn-sm me-3"
        >
          <img src={login} alt="Login" width="32px" />
        </button>
      </li>
    </>
  );
};

export default Login;
