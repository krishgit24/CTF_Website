import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import Navbar from '../components/admin/AdminNavbar';
import { logsData, LOGS_PER_PAGE, TOTAL_LOGS, CHALLENGE_CATEGORIES } from '../data/logsData';
import { Search, RefreshCw, ChevronLeft, ChevronRight, ArrowLeft, ChevronDown, CheckCircle, XCircle } from 'lucide-react';

const Logs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter logs based on search and category
  const filteredLogs = useMemo(() => {
    return logsData.filter(log => {
      const matchesSearch = log.teamName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || log.challengeCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalFilteredLogs = filteredLogs.length;
  const totalPages = Math.ceil(totalFilteredLogs / LOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
  const endIndex = startIndex + LOGS_PER_PAGE;
  const currentData = filteredLogs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    if (status === 'correct') {
      return (
        <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
          <CheckCircle className="w-3 h-3" />
          <span className="hidden sm:inline">Correct</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
        <XCircle className="w-3 h-3" />
        <span className="hidden sm:inline">Incorrect</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Activity Logs</h1>
            <p className="text-gray-500 text-sm">
              Monitor real-time submission activity and challenge results from all competing teams.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Leaderboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Team"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            {/* Category Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors min-w-[140px] sm:min-w-[180px] justify-between"
              >
                <span className="text-gray-700 truncate">{selectedCategory}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 sm:right-auto mt-1 w-full sm:w-64 max-h-64 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {CHALLENGE_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors
                        ${selectedCategory === category ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shrink-0">
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-4">Team Name</div>
            <div className="col-span-4">Challenge Category</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-50">
            {currentData.length > 0 ? (
              currentData.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                >
                  {/* Timestamp */}
                  <div className="col-span-2 text-sm text-gray-500">
                    {log.timestamp}
                  </div>

                  {/* Team Name */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${log.teamColor} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{log.teamInitials}</span>
                    </div>
                    <span className="font-medium text-gray-900">{log.teamName}</span>
                  </div>

                  {/* Challenge Category */}
                  <div className="col-span-4">
                    <span className={`text-sm ${log.status === 'incorrect' ? 'text-red-500' : 'text-blue-600'}`}>
                      {log.challengeCategory}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex justify-end">
                    <StatusBadge status={log.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                No logs found matching your criteria.
              </div>
            )}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {currentData.length > 0 ? (
            currentData.map((log) => (
              <div
                key={log.id}
                className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${log.teamColor} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-sm font-bold">{log.teamInitials}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{log.teamName}</div>
                      <div className="text-xs text-gray-500">{log.timestamp}</div>
                    </div>
                  </div>
                  <StatusBadge status={log.status} />
                </div>

                <div className="pt-3 border-t border-gray-50">
                  <span className={`text-sm ${log.status === 'incorrect' ? 'text-red-500' : 'text-blue-600'}`}>
                    {log.challengeCategory}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-500 bg-gray-50 rounded-xl">
              No logs found matching your criteria.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalFilteredLogs > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm">
            <div className="text-gray-500 text-center sm:text-left">
              Showing <span className="text-blue-600 font-medium">{startIndex + 1}-{Math.min(endIndex, totalFilteredLogs)}</span> of <span className="font-medium">{totalFilteredLogs}</span> results
            </div>

            <div className="flex items-center gap-1">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors
                      ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    {page}
                  </button>
                )
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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