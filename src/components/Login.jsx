import { useEffect } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import login from "../assets/login.png";
import logout from "../assets/logout.png";

const Login = () => {
  const { instance, inProgress } = useMsal();

  const initializeSignIn = () => {
    if (!instance.getActiveAccount() && inProgress !== "login") {
      instance
        .loginRedirect({
          prompt: "select_account",
        })
        .catch((e) => {
          if (e instanceof InteractionRequiredAuthError) {
            console.error("Interaction required:", e);
          } else {
            console.error(e);
          }
        });
    }
  };

  const initializeSignout = () => {
    instance.logoutRedirect().catch((e) => {
      console.error(e);
    });
  };

  return (
    <>
      <AuthenticatedTemplate>
        <li className="nav-item me-2">
          <button
            title="logout"
            type="button"
            onClick={initializeSignout}
            className="btn rounded-circle btn-sm me-3"
          >
            <img src={logout} alt="Login" width="32px" />
          </button>
        </li>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
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
      </UnauthenticatedTemplate>
    </>
  );
};
export default Login;
