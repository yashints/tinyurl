import AppHome from "./components/App";
import { Routes, Route } from "react-router-dom";

export default function App({ pca }) {
  return (
    <Routes>
      <Route path="/" element={<AppHome pca={pca} />} />
    </Routes>
  );
}
