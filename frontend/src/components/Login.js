import { useMsal } from "@azure/msal-react";
import login from "../assets/login.png";

const Login = () => {
  const { instance } = useMsal();

  const initializeSignIn = () => {
    instance.loginRedirect();
  };

  return (
    <>
      <li className="nav-item me-2">
        <button
          title="login"
          type="button"
          onClick={initializeSignIn}
          class="btn rounded-circle btn-sm me-3"
        >
          <img src={login} alt="Login" width="32px" />
        </button>
      </li>
    </>
  );
};

export default Login;
