import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ForgotPassword from "./Pages/Forgot";
import StudentPage from "./Pages/StudentPage";
import Attendance from "./Pages/Attendance";
import Profile from "./Component/Profile";
import Private from "./Component/ProtectedRoute/Private";
import Public from "./Component/ProtectedRoute/Public";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Public Component={Login} />} />
        <Route path="/signUp" element={<Public Component={Signup} />} />
        <Route path="/forgot" element={<Public Component={ForgotPassword} />} />
        <Route path="/studentPage" element={<Private Component={StudentPage} />} />
        <Route path="/profile" element={<Private Component={Profile} />} />
        <Route path="/attendance" element={<Private Component={Attendance} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
