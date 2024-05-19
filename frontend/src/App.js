import AppHome from "./components/App";
import { Routes, Route } from "react-router-dom";
import NoMatch from "./components/NoMatch";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppHome />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}
