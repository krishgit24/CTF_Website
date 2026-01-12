import React, { useState } from 'react';
import Navbar from '../components/admin/AdminNavbar';
import { leaderboardData, ITEMS_PER_PAGE, TOTAL_TEAMS } from '../data/leaderboardData';
import { Trophy, Users, ChevronLeft, ChevronRight } from 'lucide-react';

// Trophy icon component for top 3 ranks
const TrophyIcon = ({ rank }) => {
  const colors = {
    1: 'text-yellow-500',
    2: 'text-gray-400',
    3: 'text-amber-600'
  };

  return <Trophy className={`w-5 h-5 ${colors[rank]}`} />;
};

// Avatar component
const TeamAvatar = ({ avatar, name, size = 'default' }) => {
  const sizeClasses = size === 'small' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg';

  if (avatar === '🟠') {
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center`}>
        <span className="text-white font-bold">{name.charAt(0)}</span>
      </div>
    );
  }
  if (avatar === '🔵') {
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center`}>
        <span className="text-white font-bold">{name.charAt(0)}</span>
      </div>
    );
  }
  return null;
};

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(TOTAL_TEAMS / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = leaderboardData.slice(startIndex, endIndex);

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Event Leaderboard</h1>
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-sm">{TOTAL_TEAMS} Participating Teams</span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Team Name</div>
            <div className="col-span-3 text-center">Challenges Solved</div>
            <div className="col-span-3 text-right">Total Points</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-50">
            {currentData.map((team) => (
              <div
                key={team.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  {team.rank <= 3 ? (
                    <TrophyIcon rank={team.rank} />
                  ) : (
                    <span className="text-gray-600 font-medium">{team.rank}</span>
                  )}
                </div>

                {/* Team Name */}
                <div className="col-span-5 flex items-center gap-3">
                  {team.avatar && <TeamAvatar avatar={team.avatar} name={team.name} />}
                  <div>
                    <div className="font-semibold text-gray-900">{team.name}</div>
                    {team.badge && (
                      <div className="text-xs text-gray-400">{team.badge}</div>
                    )}
                  </div>
                </div>

                {/* Challenges Solved */}
                <div className="col-span-3 text-center text-gray-600">
                  {team.challengesSolved} / {team.totalChallenges}
                </div>

                {/* Points */}
                <div className="col-span-3 text-right">
                  <span className={`font-bold ${team.rank <= 3 ? 'text-blue-600' : 'text-gray-900'}`}>
                    {team.points.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {currentData.map((team) => (
            <div
              key={team.id}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${team.rank <= 3
                    ? team.rank === 1 ? 'bg-yellow-100' : team.rank === 2 ? 'bg-gray-100' : 'bg-amber-100'
                    : 'bg-gray-50'
                    }`}>
                    {team.rank <= 3 ? (
                      <TrophyIcon rank={team.rank} />
                    ) : (
                      <span className="text-gray-600 text-sm font-medium">{team.rank}</span>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="flex items-center gap-2">
                    {team.avatar && <TeamAvatar avatar={team.avatar} name={team.name} size="small" />}
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{team.name}</div>
                      {team.badge && (
                        <div className="text-xs text-gray-400">{team.badge}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{team.challengesSolved}/{team.totalChallenges}</span> solved
                </div>
                <div>
                  <span className={`font-bold text-lg ${team.rank <= 3 ? 'text-blue-600' : 'text-gray-900'}`}>
                    {team.points.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm">
          <div className="text-gray-500 text-center sm:text-left">
            Showing <span className="text-blue-600 font-medium">{startIndex + 1}-{Math.min(endIndex, TOTAL_TEAMS)}</span> of <span className="font-medium">{TOTAL_TEAMS}</span> teams
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
              disabled={currentPage === totalPages}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="text-center sm:text-left">
            <p>© 2023 CTF Competition. All rights reserved.</p>
            <p className="text-blue-500 text-xs">Organized by Security Research Group</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Leaderboard;