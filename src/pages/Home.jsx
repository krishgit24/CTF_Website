import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/dashboard");
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4">
      <h1 className="mt-16 mb-10 text-center">
        <span className="block text-sm tracking-[0.3em] text-gray-400 mb-2">
          IEEE VESIT PRESENTS
        </span>
        <span className="block text-4xl md:text-5xl font-extrabold text-yellow-400">
          CTF CHALLENGE
        </span>
      </h1>

      <AuthPage />
    </div>
  );
};

export default Home;
