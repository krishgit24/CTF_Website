import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import StatCard from "../components/StatCard";
import ChallengeCard from "../components/ChallengeCard";
import ChallengeModal from "../components/ChallengeModal";
import { supabase } from "../supabaseClient";

const ParticipantDashboard = () => {
  const [open, setOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalScore: 0,
    solvedCount: 0,
  });

  useEffect(() => {
    fetchChallenges();
    fetchUserStats();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setChallenges(data || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserStats({ totalScore: 0, solvedCount: 0 });
        return;
      }

      // Fetch user's score from users table (SINGLE SOURCE OF TRUTH)
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("score")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        setUserStats({ totalScore: 0, solvedCount: 0 });
        return;
      }

      // Fetch count of solved challenges
      const { data: solvedChallenges, error: solvedError } = await supabase
        .from("user_challenges")
        .select("id")
        .eq("user_id", user.id)
        .eq("solved", true);

      if (solvedError) {
        console.log("user_challenges table error:", solvedError);
        setUserStats({
          totalScore: userData?.score || 0,
          solvedCount: 0,
        });
        return;
      }

      setUserStats({
        totalScore: userData?.score || 0,
        solvedCount: solvedChallenges?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setUserStats({ totalScore: 0, solvedCount: 0 });
    }
  };

  const handleOpenModal = (challenge) => {
    setSelectedChallenge(challenge);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedChallenge(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-amber-300 text-2xl">Loading challenges...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6 relative overflow-hidden">
      {/* HEADER */}
      <div className="relative z-10 mb-6">
        <h1 className="text-4xl font-bold italic text-amber-300 tracking-wide">
          PARTICIPANT <span className="text-white">DASHBOARD</span>
        </h1>
      </div>

      {/* STATS */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard
          title="TOTAL SCORE"
          value={userStats.totalScore.toLocaleString()}
        />
        <StatCard
          title="CHALLENGES"
          value={`${userStats.solvedCount} / ${challenges.length}`}
        />
      </div>

      {/* AVAILABLE TASKS */}
      <div className="relative z-10 mb-4 flex items-center gap-2 text-yellow-400 font-semibold">
        <Shield size={18} />
        AVAILABLE TASKS
      </div>

      {/* CHALLENGE CARDS */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {challenges.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400 py-10">
            No challenges available yet.
          </div>
        ) : (
          challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              category={challenge.category}
              points={challenge.points}
              title={challenge.title}
              description={challenge.description}
              onClick={() => handleOpenModal(challenge)}
            />
          ))
        )}
      </div>

      {/* MODAL */}
      <ChallengeModal
        isOpen={open}
        onClose={handleCloseModal}
        challenge={selectedChallenge}
        onSolve={fetchUserStats}
      />
    </div>
  );
};

export default ParticipantDashboard;