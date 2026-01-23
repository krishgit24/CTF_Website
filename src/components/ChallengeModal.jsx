import { useState } from "react";
import { X, File, Flag, Download } from "lucide-react";
import { supabase } from "../supabaseClient";

const ChallengeModal = ({ isOpen, onClose, challenge, onSolve }) => {
  const [flagInput, setFlagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  if (!isOpen || !challenge) return null;

  const handleSubmitFlag = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage({
          type: "error",
          text: "You must be logged in to submit flags",
        });
        setSubmitting(false);
        return;
      }

      // Check if flag is correct
      if (flagInput.trim() !== challenge.flag.trim()) {
        setMessage({ type: "error", text: "❌ Incorrect flag. Try again!" });
        setSubmitting(false);
        return;
      }

      // Check if already solved
      const { data: existing } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("user_id", user.id)
        .eq("challenge_id", challenge.id)
        .single();

      if (existing?.solved) {
        setMessage({
          type: "info",
          text: "You've already solved this challenge!",
        });
        setSubmitting(false);
        return;
      }

      // Mark as solved
      const { error } = await supabase.from("user_challenges").upsert({
        user_id: user.id,
        challenge_id: challenge.id,
        solved: true,
        points: challenge.points,
        solved_at: new Date().toISOString(),
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: `🎉 Correct! +${challenge.points} points!`,
      });
      setFlagInput("");

      // Refresh stats in parent
      if (onSolve) {
        setTimeout(() => {
          onSolve();
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting flag:", error);
      setMessage({
        type: "error",
        text: "Error submitting flag. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-zinc-900 to-black border-2 border-yellow-400 rounded-lg p-6 shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] text-yellow-400 border px-2 py-1 rounded">
                {challenge.category}
              </span>
              <span className="text-[11px] text-gray-400 border px-2 py-1 rounded">
                {challenge.points} pts
              </span>
            </div>

            <h2 className="text-2xl font-bold">{challenge.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {challenge.description || "No description available"}
        </p>

        {/* RESOURCES */}
        {challenge.resource_link && (
          <div className="border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-xs text-yellow-400 mb-3 font-semibold">RESOURCES</p>
            <ul className="space-y-2">
              <li>
                <a
                  href={challenge.resource_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-yellow-400 transition-colors cursor-pointer group"
                >
                  <Download size={14} className="group-hover:animate-bounce" />
                  <span className="underline">Download Challenge Files</span>
                </a>
              </li>
            </ul>
          </div>
        )}

        {/* META */}
        <div className="flex items-center gap-6 text-xs text-gray-500 mb-6">
          <span>
            🏆 SOLVES: <span className="text-gray-300">0</span>
          </span>
          <span>
            📅 CREATED:{" "}
            <span className="text-gray-300">
              {new Date(challenge.created_at).toLocaleDateString()}
            </span>
          </span>
        </div>

        {/* SUBMIT FORM */}
        <form onSubmit={handleSubmitFlag}>
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">SUBMIT FLAG</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 bg-black border border-yellow-500/30 rounded-lg px-3 py-2">
                <Flag size={14} className="text-yellow-400" />
                <input
                  type="text"
                  placeholder="ROOT{your_flag_here}"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  disabled={submitting}
                  className="bg-transparent outline-none text-sm text-white w-full disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !flagInput.trim()}
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "..." : "SUBMIT >"}
              </button>
            </div>
          </div>

          {/* MESSAGE */}
          {message.text && (
            <div
              className={`p-3 rounded-lg text-sm font-semibold mb-4 ${
                message.type === "success"
                  ? "bg-green-900/50 text-green-300 border border-green-500/30"
                  : message.type === "error"
                  ? "bg-red-900/50 text-red-300 border border-red-500/30"
                  : "bg-blue-900/50 text-blue-300 border border-blue-500/30"
              }`}
            >
              {message.text}
            </div>
          )}
        </form>

        {/* FOOTER */}
        <div className="flex justify-between text-[10px] text-gray-500 mt-6">
          <div>SECURE CONNECTION ACTIVE</div>
          <div>CHAL_ID: {challenge.id.slice(0, 8)}</div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;