const StatCard = ({ title, value }) => {
  return (
    <div className="bg-gradient-to-b from-zinc-900 to-black border border-yellow-500/20 rounded-xl p-6 shadow-lg">
      <p className="text-lg tracking-widest mb-2">{title}</p>
      <p className="text-3xl font-bold text-yellow-400">{value}</p>
    </div>
  );
};

export default StatCard;