import { useState, useMemo, useEffect } from "react";
import { supabase } from "../supabaseClient";

const ITEMS_PER_PAGE = 6;
const CATEGORIES = ["ALL", "CRYPTOGRAPHY", "WEB", "FORENSICS", "REVERSE", "PWN", "MISC"];

const Form = () => {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        points: "",
        description: "",
        resource_link: "",
        flag: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtering & Pagination State
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    // ============ FETCH CHALLENGES ON MOUNT ============
    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("challenges")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            setChallenges(data || []);
        } catch (error) {
            console.error("Error fetching challenges:", error);
            alert("Failed to fetch challenges");
        } finally {
            setLoading(false);
        }
    };

    // ============ FILTERED & PAGINATED DATA ============

    const filteredChallenges = useMemo(() => {
        return challenges.filter((challenge) => {
            const matchesSearch =
                challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (challenge.description && challenge.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory =
                categoryFilter === "ALL" || challenge.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [challenges, searchQuery, categoryFilter]);

    const totalPages = Math.ceil(filteredChallenges.length / ITEMS_PER_PAGE);
    const paginatedChallenges = filteredChallenges.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset to page 1 when filters change
    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (category) => {
        setCategoryFilter(category);
        setCurrentPage(1);
    };

    // ============ FORM HANDLERS ============

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data, error } = await supabase.from("challenges").insert([
                {
                    title: formData.title,
                    category: formData.category,
                    points: parseInt(formData.points) || 0,
                    description: formData.description,
                    resource_link: formData.resource_link || null,
                    flag: formData.flag,
                },
            ]).select();

            if (error) throw error;

            // Add the new challenge to the local state
            setChallenges((prev) => [data[0], ...prev]);

            // Reset form
            setFormData({
                title: "",
                category: "",
                points: "",
                description: "",
                resource_link: "",
                flag: "",
            });

            alert("Challenge added successfully! ✅");
        } catch (error) {
            console.error("Error adding challenge:", error);
            alert("Failed to add challenge: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this challenge?")) {
            return;
        }

        try {
            const { error } = await supabase
                .from("challenges")
                .delete()
                .eq("id", id);

            if (error) throw error;

            // Remove from local state
            setChallenges((prev) => prev.filter((c) => c.id !== id));
            alert("Challenge deleted successfully! 🗑️");
        } catch (error) {
            console.error("Error deleting challenge:", error);
            alert("Failed to delete challenge: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-yellow-400 text-2xl">Loading challenges...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black px-4 py-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <span className="block text-sm tracking-[0.3em] text-gray-400 mb-2">
                        ADMIN PANEL
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400">
                        CHALLENGE MANAGER
                    </h1>
                </div>

                {/* Add Challenge Form */}
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 rounded-2xl p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
                        <span>➕</span> Add New Challenge
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Challenge Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., BROKEN_RSA_PADDING"
                                required
                                className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600"
                            />
                        </div>

                        {/* Category & Points Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                >
                                    <option value="">Select Category</option>
                                    <option value="CRYPTOGRAPHY">CRYPTOGRAPHY</option>
                                    <option value="WEB">WEB</option>
                                    <option value="FORENSICS">FORENSICS</option>
                                    <option value="REVERSE">REVERSE ENGINEERING</option>
                                    <option value="PWN">PWN</option>
                                    <option value="MISC">MISC</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Points *
                                </label>
                                <input
                                    type="number"
                                    name="points"
                                    value={formData.points}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 500"
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the challenge..."
                                required
                                rows={4}
                                className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600 resize-none"
                            />
                        </div>

                        {/* Resource Link */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Resource / Drive Link
                            </label>
                            <input
                                type="url"
                                name="resource_link"
                                value={formData.resource_link}
                                onChange={handleInputChange}
                                placeholder="https://drive.google.com/... (optional, add later if needed)"
                                className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                💡 You can leave this empty now and add the link later
                            </p>
                        </div>

                        {/* Flag (Secret) */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Flag (Secret Answer) *
                            </label>
                            <input
                                type="text"
                                name="flag"
                                value={formData.flag}
                                onChange={handleInputChange}
                                placeholder="ROOT{your_secret_flag}"
                                required
                                className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-700 disabled:to-gray-800 text-black font-bold rounded-lg transition-all duration-300 text-lg disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "⏳ Submitting..." : "🚀 Add Challenge"}
                        </button>
                    </form>
                </div>

                {/* Existing Challenges List */}
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-gray-800 rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                            <span>📋</span> Existing Challenges
                            <span className="ml-2 px-3 py-1 bg-gray-800 text-gray-400 text-sm rounded-full font-normal">
                                {filteredChallenges.length} of {challenges.length}
                            </span>
                        </h2>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                🔍
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search challenges..."
                                className="w-full pl-12 pr-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-200 border ${
                                        categoryFilter === cat
                                            ? "bg-yellow-500 text-black border-yellow-500"
                                            : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Challenges Grid */}
                    {paginatedChallenges.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-xl">
                            <span className="text-4xl block mb-3">🎯</span>
                            <p className="text-gray-500">
                                {challenges.length === 0
                                    ? "No challenges yet. Add one above!"
                                    : "No challenges match your filters."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {paginatedChallenges.map((challenge) => (
                                    <div
                                        key={challenge.id}
                                        className="group relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl p-5 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                                    >
                                        {/* Category & Points Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="px-2 py-1 text-[10px] font-bold tracking-wider bg-purple-900/60 text-purple-300 border border-purple-500/30 rounded-full truncate max-w-[100px]">
                                                {challenge.category}
                                            </span>
                                            <span className="px-2 py-1 text-[10px] font-bold bg-yellow-900/60 text-yellow-300 border border-yellow-500/30 rounded-full flex items-center gap-1">
                                                ⭐ {challenge.points}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base font-bold text-white font-mono mb-2 group-hover:text-yellow-400 transition-colors truncate">
                                            {challenge.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                                            {challenge.description}
                                        </p>

                                        {/* Resources indicator */}
                                        {challenge.resource_link && (
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                                                <span>🔗</span>
                                                <span className="truncate">Resource attached</span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                <span>Active</span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(challenge.id)}
                                                className="px-2 py-1 text-xs text-red-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/50 rounded-lg transition-all duration-200"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-800">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        ← Prev
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                            (page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-10 h-10 text-sm rounded-lg transition-all duration-200 ${
                                                        currentPage === page
                                                            ? "bg-yellow-500 text-black font-bold"
                                                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Form;