import { useEffect } from "react";
import AppHome from "./components/App";
import { Routes, Route } from "react-router-dom";
import NoMatch from "./components/NoMatch";

const App = () => {
  useEffect(() => {
    const itemKey = "msal.interaction.status";
    if (sessionStorage.getItem(itemKey)) {
      sessionStorage.removeItem(itemKey);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<AppHome />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};

export default App;
