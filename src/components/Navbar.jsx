import {
  LayoutDashboard,
  Home,
  Trophy,
  FileText,
  ShieldCheck,
  Menu,
  X,
  Crown,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Navbar = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  /* ---------- AUTH STATE ---------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();

        console.log("🔍 Auth Check:", { 
          hasUser: !!authData?.user, 
          userId: authData?.user?.id,
          error: authError 
        });

        // If there's an auth error or no user, clear everything
        if (authError || !authData?.user) {
          console.log("❌ No user found, clearing state");
          setIsLoggedIn(false);
          setTeamName("");
          setIsAdmin(false);
          return;
        }

        console.log("✅ User authenticated:", authData.user.email);
        setIsLoggedIn(true);

        // Try to fetch user data from database
        const { data, error: dbError } = await supabase
          .from("users")
          .select("team_name, is_admin")
          .eq("id", authData.user.id)
          .single();

        console.log("🔍 Database Check:", { 
          hasData: !!data, 
          teamName: data?.team_name,
          isAdmin: data?.is_admin,
          error: dbError 
        });

        // If user was deleted from database but session still exists
        if (dbError) {
          console.error("❌ User not found in database:", dbError);
          console.log("🧹 Clearing session for deleted user");
          await supabase.auth.signOut();
          setIsLoggedIn(false);
          setTeamName("");
          setIsAdmin(false);
          return;
        }

        if (!data) {
          console.error("❌ No data returned from database");
          await supabase.auth.signOut();
          setIsLoggedIn(false);
          setTeamName("");
          setIsAdmin(false);
          return;
        }

        // Set user data
        setTeamName(data.team_name || "");
        setIsAdmin(data.is_admin || false);
        
        console.log("✅ User state updated:", {
          teamName: data.team_name,
          isAdmin: data.is_admin,
          isLoggedIn: true
        });

      } catch (error) {
        console.error("💥 Error fetching user:", error);
        // On any error, clear the session
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        setTeamName("");
        setIsAdmin(false);
      }
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 Auth state changed:", event, { hasSession: !!session });
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log("👋 User signed out");
        setIsLoggedIn(false);
        setTeamName("");
        setIsAdmin(false);
      } else if (event === 'SIGNED_IN') {
        console.log("👋 User signed in");
        fetchUser();
      } else {
        fetchUser();
      }
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  /* ---------- LOGOUT ---------- */
  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ Logout error:", error);
      } else {
        console.log("✅ Signed out from Supabase");
      }
      
      // Clear all local state
      setIsLoggedIn(false);
      setTeamName("");
      setIsAdmin(false);
      setOpen(false);
      
      // Clear localStorage
      localStorage.clear();
      console.log("✅ Cleared localStorage");
      
      // Navigate to home
      navigate("/");
      console.log("✅ Navigated to home");
      
    } catch (error) {
      console.error("💥 Error during logout:", error);
      // Force logout even if there's an error
      setIsLoggedIn(false);
      setTeamName("");
      setIsAdmin(false);
      setOpen(false);
      localStorage.clear();
      navigate("/");
    }
  };

  // Debug: Log current state on every render
  console.log("🎨 Navbar Render:", { 
    isLoggedIn, 
    teamName, 
    isAdmin,
    path 
  });

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">

            {/* LOGO */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <ShieldCheck className="w-8 h-8 text-yellow-400 group-hover:rotate-3 transition" />
              <span className="text-xl font-bold text-white">
                IEEE <span className="text-yellow-400">CTF</span>
              </span>
            </div>

            {/* CENTER NAV */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
              {!isLoggedIn && (
                <NavLink path="/" icon={Home} label="Home" active={path === "/"} />
              )}

              {isLoggedIn && (
                <>
                  <NavLink
                    path="/dashboard"
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={path === "/dashboard"}
                  />

                  {isAdmin && (
                    <>
                      <NavLink
                        path="/leaderboard"
                        icon={Trophy}
                        label="Leaderboard"
                        active={path === "/leaderboard"}
                      />
                      <NavLink
                        path="/logs"
                        icon={FileText}
                        label="Logs"
                        active={path === "/logs"}
                      />
                      <NavLink
                        path="/Form"
                        icon={FileText}
                        label="Form"
                        active={path === "/Form"}
                      />
                    </>
                  )}
                </>
              )}
            </div>

            {/* RIGHT SIDE - SHOW LOGOUT IF LOGGED IN */}
            <div className="hidden lg:flex items-center gap-4">
              {isLoggedIn && (
                <>
                  {teamName && <TeamBadge teamName={teamName} />}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-gray-300 hover:border-red-500 hover:text-red-400 transition"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden text-gray-400 hover:text-yellow-400"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-xl z-40">
          <div className="p-4 space-y-2">
            {!isLoggedIn && (
              <MobileNavLink
                path="/"
                label="Home"
                active={path === "/"}
                onClick={() => setOpen(false)}
              />
            )}

            {isLoggedIn && (
              <>
                <MobileNavLink
                  path="/dashboard"
                  label="Dashboard"
                  active={path === "/dashboard"}
                  onClick={() => setOpen(false)}
                />

                {isAdmin && (
                  <>
                    <MobileNavLink
                      path="/leaderboard"
                      label="Leaderboard"
                      active={path === "/leaderboard"}
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavLink
                      path="/logs"
                      label="Logs"
                      active={path === "/logs"}
                      onClick={() => setOpen(false)}
                    />

                    <MobileNavLink
                      path="/Form"
                      label="Form"
                      active={path === "/Form"}
                      onClick={() => setOpen(false)}
                    />
                  </>
                )}

                <div className="pt-4">
                  {teamName && <TeamBadge teamName={teamName} mobile />}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-4 py-3 rounded-lg border border-red-500 text-red-400 hover:bg-red-500/10 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* ---------- TEAM BADGE ---------- */
const TeamBadge = ({ teamName, mobile = false }) => (
  <div className={`relative ${mobile ? "w-full" : ""}`}>
    <div className="bg-zinc-900 border border-yellow-400/30 rounded-lg px-4 py-2 flex items-center gap-3">
      <Crown className="text-yellow-400" size={18} />
      <span className="font-bold text-sm bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent truncate">
        {teamName}
      </span>
    </div>
  </div>
);

/* ---------- LINKS ---------- */
const NavLink = ({ path, icon: Icon, label, active }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
        active
          ? "text-yellow-400 bg-yellow-400/10"
          : "text-gray-400 hover:text-yellow-400 hover:bg-zinc-800"
      }`}
    >
      <Icon size={18} />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
};

const MobileNavLink = ({ path, label, active, onClick }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(path);
        onClick?.();
      }}
      className={`w-full px-4 py-3 rounded-lg text-left transition ${
        active
          ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30"
          : "text-gray-300 hover:bg-zinc-800"
      }`}
    >
      {label}
    </button>
  );
};

export default Navbar;