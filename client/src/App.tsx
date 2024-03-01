import { Route, Routes, Navigate } from "react-router-dom";
import Landing from './pages/Landing'
import SignIn from "./pages/SignIn";
import Connect from "./pages/Connect";
import Dashboard from "./pages/Dashboard";
import Receive from './pages/payments/Receive'

function App() {
  return (
    // <div className="w-full h-screen flex justify-center items-center">
    // <div className="w-full h-screen">
      <Routes>
        <Route path="/*">
          <Route index element={<Navigate to="landing" />} />
          <Route path="landing" element={<Landing />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="connect" element={<Connect />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="receive" element={<Receive />} />
        </Route>
      </Routes>
    // </div>
  );
}

export default App;
