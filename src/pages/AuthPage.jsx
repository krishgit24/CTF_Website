import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const ShieldCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-yellow-400"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const EyeIcon = ({ visible }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block ml-1 transition-transform duration-200 group-hover:translate-x-1"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    teamName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!isLogin) {
        if (!formData.teamName.trim()) {
          setError("Please enter a team name");
          setLoading(false);
          return;
        }

        if (formData.teamName.length < 3) {
          setError("Team name must be at least 3 characters");
          setLoading(false);
          return;
        }

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;
        if (!authData?.user) throw new Error("Signup failed");

        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            team_name: formData.teamName.trim(),
            is_admin: false
          })
          .select()
          .single();

        if (insertError) {
          if (insertError.code === '23505') {
            await supabase
              .from("users")
              .update({ team_name: formData.teamName.trim() })
              .eq("id", authData.user.id);
          } else {
            throw insertError;
          }
        }

        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgb(250, 204, 21) 1px, transparent 1px),
                           linear-gradient(90deg, rgb(250, 204, 21) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-8 sm:p-10 transition-all duration-500 hover:border-yellow-400/40 shadow-2xl shadow-yellow-400/5 hover:shadow-yellow-400/10">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse" />
              <div className="relative flex items-center gap-3 bg-zinc-900/50 px-5 py-3 rounded-full border border-yellow-400/30">
                <ShieldCheckIcon />
                <span className="text-yellow-400 font-bold text-lg tracking-wider">
                  IEEE CTF
                </span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mt-8 tracking-tight">
              {isLogin ? "Welcome Back" : "Join the Challenge"}
            </h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">
              {isLogin
                ? "Sign in to access your dashboard"
                : "Create your team and start competing"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-fadeIn">
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Team Name
                </label>
                <input
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="Enter your team name"
                  className="w-full bg-zinc-900/50 px-4 py-3.5 rounded-xl border border-zinc-700/50 text-gray-100 placeholder-gray-600 hover:border-yellow-400/40 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-zinc-900/50 px-4 py-3.5 rounded-xl border border-zinc-700/50 text-gray-100 placeholder-gray-600 hover:border-yellow-400/40 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/50 px-4 py-3.5 rounded-xl pr-12 border border-zinc-700/50 text-gray-100 placeholder-gray-600 hover:border-yellow-400/40 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-yellow-400/10 transition-colors duration-200"
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-900/50 text-red-300 border border-red-500/30 text-sm">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3.5 rounded-xl mt-6 font-bold text-base transition-all duration-200 hover:from-yellow-300 hover:to-yellow-400 hover:shadow-lg hover:shadow-yellow-400/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {!isLogin ? "Creating account..." : "Signing in..."}
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-3 text-gray-500 font-medium">
                or
              </span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
              className="group text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin
                ? "No account? Register your team"
                : "Already registered? Sign in"}
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;