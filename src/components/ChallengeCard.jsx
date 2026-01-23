import { Play } from "lucide-react";

const ChallengeCard = ({ category, points, title, description, onClick }) => {
  // Calculate a mock success rate based on points (you can make this dynamic later)
  const rate = Math.min(100, Math.max(10, 100 - (points / 10)));

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer bg-gradient-to-b from-zinc-900 to-black border border-yellow-500/20 rounded-xl p-6 shadow-lg hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-200"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] text-yellow-400 border border-yellow-400/30 px-2 py-1 rounded">
          {category}
        </span>
        <span className="text-xs text-yellow-400 font-semibold">{points} pts</span>
      </div>

      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-6 line-clamp-2">
        {description || "No description available"}
      </p>

      <div className="mb-6">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">SUCCESS RATE</span>
          <span className="text-yellow-400">{rate.toFixed(0)}%</span>
        </div>
        <div className="w-full h-1 bg-gray-800 rounded-full">
          <div
            className="h-full bg-yellow-400"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      <button className="w-full bg-white text-black py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors">
        <Play size={16} />
        INITIALIZE SESSION
      </button>
    </div>
  );
};

export default ChallengeCard;