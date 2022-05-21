import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import PelangganList from "./components/pelanggan/PelangganList.js";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route exact path="/pelanggan" element={<PelangganList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
