import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Analytics from "./pages/Analytics";
import Courses from "./pages/courses";
import Enrollment from "./pages/enrollment";
import Students from "./pages/students";
import Dashboardpage from "./pages/Dashboardpage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route path="/analytics" element={<Analytics />} />
        <Route path="courses" element={<Courses />} />
        <Route path="enrollment" element={<Enrollment />} />
        <Route path="students" element={<Students />} />
        <Route path="dashboardpage" element={<Dashboardpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
