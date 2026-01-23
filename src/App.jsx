import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import AuthPage from "./pages/AuthPage";
import Leaderboard from "./pages/Leaderboard";
import Logs from "./pages/Logs"
import Form from "./pages/Form"

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-yellow-400">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="dashboard" element={<ParticipantDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/Form" element={<Form />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;