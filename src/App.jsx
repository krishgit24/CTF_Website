import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Navigate, Route, Routes } from "react-router";
import Leaderboard from "./pages/Leaderboard";
import Logs from "./pages/Logs";

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>

    </div>
  )
}

export default App
