import { Route, Routes, Navigate } from "react-router-dom";
import Landing from './pages/Landing'
import SignIn from "./pages/SignIn";
import Connect from "./pages/Connect";
import Dashboard from "./pages/Dashboard";
import Receive from './pages/payments/Receive'
import Send from './pages/payments/Send'

function App() {
  return (
      <Routes>
        <Route path="/*">
          <Route index element={<Navigate to="landing" />} />
          <Route path="landing" element={<Landing />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="connect" element={<Connect />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="receive" element={<Receive />} />
          <Route path="send" element={<Send />} />
        </Route>
      </Routes>
  );
}

export default App;
