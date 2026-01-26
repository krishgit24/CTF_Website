import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "../supabaseClient";

const LOGS_PER_PAGE = 20;

const Logs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All Categories"]);

  useEffect(() => {
    fetchLogs();
    fetchCategories();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("submission_logs_detailed")
        .select("*")
        .order("submitted_at", { ascending: false })
        .limit(500); // Limit to recent 500 submissions

      if (error) throw error;

      setLogsData(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("category")
        .order("category");

      if (error) throw error;

      const uniqueCategories = [
        "All Categories",
        ...new Set(data.map((c) => c.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredLogs = useMemo(() => {
    return logsData.filter((log) => {
      const matchesSearch = log.team_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" ||
        log.challenge_category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [logsData, searchQuery, selectedCategory]);

  const totalFilteredLogs = filteredLogs.length;
  const totalPages = Math.ceil(totalFilteredLogs / LOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
  const endIndex = startIndex + LOGS_PER_PAGE;
  const currentData = filteredLogs.slice(startIndex, endIndex);

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

  const StatusBadge = ({ status }) =>
    status ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
        <CheckCircle className="w-3 h-3" />
        Correct
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30">
        <XCircle className="w-3 h-3" />
        Incorrect
      </span>
    );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-yellow-400 text-2xl">Loading logs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6">
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold italic tracking-wide text-yellow-400">
              ACTIVITY <span className="text-white">LOGS</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Track all submissions and challenge attempts.
            </p>
          </div>

          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leaderboard
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by team name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 min-w-[200px] justify-between"
            >
              <span className="truncate">{selectedCategory}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg max-h-64 overflow-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 ${
                      selectedCategory === category
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchLogs}
            className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800 text-xs font-semibold text-yellow-400 uppercase">
            <div className="col-span-2">Time</div>
            <div className="col-span-4">Team</div>
            <div className="col-span-4">Challenge</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          <div className="divide-y divide-zinc-800">
            {currentData.length > 0 ? (
              currentData.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-800"
                >
                  <div className="col-span-2 text-sm text-gray-400">
                    {formatTime(log.submitted_at)}
                  </div>

                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {log.team_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{log.team_name}</span>
                  </div>

                  <div className="col-span-4 text-sm">
                    <div className="text-gray-300">{log.challenge_title}</div>
                    <div className="text-xs text-gray-500">
                      {log.challenge_category}
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <StatusBadge status={log.is_correct} />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-400">
                No logs found.
              </div>
            )}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {currentData.map((log) => (
            <div
              key={log.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {log.team_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{log.team_name}</div>
                    <div className="text-xs text-gray-400">
                      {formatTime(log.submitted_at)}
                    </div>
                  </div>
                </div>
                <StatusBadge status={log.is_correct} />
              </div>

              <div className="pt-3 border-t border-zinc-800">
                <div className="text-sm text-gray-300">{log.challenge_title}</div>
                <div className="text-xs text-gray-500">{log.challenge_category}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalFilteredLogs > 0 && (
          <div className="flex justify-between items-center mt-8 text-sm">
            <span className="text-gray-400">
              Showing{" "}
              <span className="text-yellow-400 font-medium">
                {startIndex + 1}-{Math.min(endIndex, totalFilteredLogs)}
              </span>{" "}
              of {totalFilteredLogs}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-zinc-800 disabled:opacity-40"
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
                    className={`w-8 h-8 rounded-md ${
                      currentPage === page
                        ? "bg-yellow-400 text-black"
                        : "hover:bg-zinc-800"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-zinc-800 disabled:opacity-40"
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

export default Logs;