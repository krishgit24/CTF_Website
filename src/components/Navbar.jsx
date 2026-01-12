import {
  LayoutDashboard,
  Home,
  Trophy,
  FileText,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const path = useLocation().pathname;
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-black border-b border-yellow-500/30">
      <div className="h-16 flex items-center px-6">
        
        {/* LEFT — LOGO */}
        <div className="flex items-center gap-2 select-none">
          <ShieldCheck size={28} className="text-yellow-400" />
          <span className="text-xl font-extrabold tracking-wider text-yellow-400">
            IEEE
            <span className="ml-1 text-yellow-300 font-mono">CTF</span>
          </span>
        </div>

        {/* CENTER — NAV (DESKTOP ONLY) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-10">
          <NavItem path="/" icon={<Home size={18} />} label="Home" active={path === "/"} />
          <NavItem path="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={path === "/dashboard"} />
          <NavItem path="/leaderboard" icon={<Trophy size={18} />} label="Leaderboard" active={path === "/leaderboard"} />
          <NavItem path="/logs" icon={<FileText size={18} />} label="Logs" active={path === "/logs"} />
        </nav>

        {/* RIGHT — TEAM (DESKTOP) */}
        <div className="hidden md:flex items-center gap-3 border border-yellow-500/30 rounded-lg px-3 py-1.5 bg-zinc-900">
          <div className="w-8 h-8 rounded-md bg-yellow-400 text-black flex items-center justify-center font-bold text-sm">
            TE
          </div>
          <div className="leading-tight">
            <p className="text-yellow-400 text-xs font-semibold uppercase">
              Team Elite
            </p>
            <p className="text-gray-400 text-[11px]">Logged In</p>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="ml-auto md:hidden text-yellow-400"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-black border-t border-yellow-500/20 px-6 py-4 space-y-4">
          
          <MobileItem label="Home" path="/" />
          <MobileItem label="Dashboard" path="/dashboard" />
          <MobileItem label="Leaderboard" path="/leaderboard" />
          <MobileItem label="Logs" path="/logs" />

          {/* TEAM INFO */}
          <div className="pt-4 border-t border-yellow-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-yellow-400 text-black flex items-center justify-center font-bold">
              TE
            </div>
            <div>
              <p className="text-yellow-400 text-sm font-semibold">Team Elite</p>
              <p className="text-gray-400 text-xs">Logged In</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const NavItem = ({ icon, label, active, path }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-2 text-sm font-medium tracking-wide transition 
        ${
          active
            ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
            : "text-gray-400 hover:text-yellow-400"
        }`}
    >
      {icon}
      {label}
    </button>
  );
};

const MobileItem = ({ label, path }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group w-full flex items-center gap-3 px-3 py-2 rounded-md
        text-gray-300 text-sm font-medium transition-all
        hover:bg-yellow-400/10 hover:text-yellow-400"
    >
      {/* left hover indicator */}
      <span className="w-1 h-5 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100 transition" />

      {label}
    </button>
  );
};


export default Navbar;
