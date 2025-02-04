import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CanvasPage from "./CanvasPage";
import Home from "./Home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/canvas" element={<CanvasPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
