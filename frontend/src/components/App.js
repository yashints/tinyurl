import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import Home from "./Home";
import Login from "./Login";
import logo from "../assets/tiny.png";
import github from "../assets/gh.png";
import Avatar from "./Avatar";
import Landing from "./Landing";

function AppHome() {
  const { accounts } = useMsal();
  const user = accounts[0];

  return (
    <>
      <nav className="navbar navbar-expand bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand fs-6" href="/">
            <img src={logo} alt="tiny url for Yashints" width="32" /> &nbsp;Yashints
          </a>
          <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
            <li className="nav-item me-2">
              <a className="nav-link py-2 px-0 px-lg-2" href="https://github.com/yashints/tinyURL">
                <img src={github} alt="GitHub" width="24" />
              </a>
            </li>
            <li className="nav-item py-2">
              <div className="vr d-lg-flex h-100 mx-lg-2 text-black"></div>
            </li>

            {user ? <Avatar /> : <Login />}
          </ul>
        </div>
      </nav>
      <main>
        <AuthenticatedTemplate>
          <Home />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Landing />
        </UnauthenticatedTemplate>
      </main>
    </>
  );
}

export default AppHome;
