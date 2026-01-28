import { useState, useEffect } from "react";
import { Trophy, Users, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { supabase } from "../supabaseClient";

const ITEMS_PER_PAGE = 10;

const TrophyIcon = ({ rank }) => {
  const colors = {
    1: "text-yellow-400",
    2: "text-gray-300",
    3: "text-amber-500",
  };

  return <Trophy className={`w-5 h-5 ${colors[rank]}`} />;
};

const TeamAvatar = ({ name, size = "default" }) => {
  const sizeClasses = size === "small" ? "w-8 h-8 text-sm" : "w-10 h-10 text-lg";

  return (
    <div
      className={`${sizeClasses} rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center`}
    >
      <span className="text-white font-bold">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
};

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTeams, setTotalTeams] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("rank", { ascending: true });

      if (error) throw error;

      setLeaderboardData(data || []);
      setTotalTeams(data?.length || 0);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalTeams / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = leaderboardData.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-yellow-400 text-2xl">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6">
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold italic tracking-wide text-yellow-400">
            EVENT <span className="text-white">LEADERBOARD</span>
          </h1>
          <div className="flex items-center gap-2 text-gray-400 mt-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{totalTeams} Participating Teams</span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800 text-xs font-semibold text-yellow-400 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Team Name</div>
            <div className="col-span-3 text-center">Solved</div>
            <div className="col-span-3 text-right">Points</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-zinc-800">
            {currentData.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400">
                No teams yet. Be the first to join!
              </div>
            ) : (
              currentData.map((team) => (
                <div
                  key={team.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-800 transition-colors"
                >
                  {/* Rank */}
                  <div className="col-span-1">
                    {team.rank <= 3 ? (
                      <TrophyIcon rank={team.rank} />
                    ) : (
                      <span className="text-gray-400 font-medium">{team.rank}</span>
                    )}
                  </div>

                  {/* Team Name */}
                  <div className="col-span-5 flex items-center gap-3">
                    <TeamAvatar name={team.team_name || "Team"} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {team.team_name || "Unnamed Team"}
                        </span>
                        {/* Admin Badge */}
                        {team.is_admin && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-[10px] font-bold">
                            <Shield className="w-3 h-3" />
                            ADMIN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Solved */}
                  <div className="col-span-3 text-center text-gray-400">
                    {team.challenges_solved} / {team.total_challenges}
                  </div>

                  {/* Points */}
                  <div className="col-span-3 text-right">
                    <span
                      className={`font-bold ${
                        team.rank <= 3 ? "text-yellow-400" : "text-white"
                      }`}
                    >
                      {team.score.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">pts</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {currentData.map((team) => (
            <div
              key={team.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  {team.rank <= 3 ? (
                    <TrophyIcon rank={team.rank} />
                  ) : (
                    <span className="text-gray-400 font-medium">#{team.rank}</span>
                  )}
                  <TeamAvatar name={team.team_name || "Team"} size="small" />
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {team.team_name || "Unnamed Team"}
                    </div>
                    {/* Admin Badge */}
                    {team.is_admin && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-[9px] font-bold mt-1">
                        <Shield className="w-2.5 h-2.5" />
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                <span className="text-gray-400 text-sm">
                  {team.challenges_solved}/{team.total_challenges} solved
                </span>
                <span className="font-bold text-yellow-400">
                  {team.score.toLocaleString()} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalTeams > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-sm">
            <div className="text-gray-400">
              Showing{" "}
              <span className="text-yellow-400 font-medium">
                {startIndex + 1}-{Math.min(endIndex, totalTeams)}
              </span>{" "}
              of <span className="font-medium">{totalTeams}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md text-gray-400 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={idx} className="px-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-md font-medium ${
                      currentPage === page
                        ? "bg-yellow-400 text-black"
                        : "text-gray-400 hover:bg-zinc-800"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md text-gray-400 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;