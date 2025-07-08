import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

const UserPreferences = () => {
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const categories = [
        "Technology",
        "Sports",
        "Music",
        "Art",
        "Cording",
        "Travel",
        "Fashion",
        "Volunteer",
        "Business",
        "Gaming",
        "Workshop",
        "Science",
        "Entertain",
        "Shirts",
        "Bangles",
    ];
    const queryClient = useQueryClient();

    const {mutate: savePreferences, isPending} = useMutation({
        mutationFn: async (categories) => {
            const res = await fetch("/api/user/userpreference", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({categories}),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save preferences");
            return data;
        },
        onSuccess: () => {
            toast.success("Preferences saved!");
            queryClient.invalidateQueries({queryKey: ["authUser"]});
            navigate("/"); // Redirect to home after saving
        },
    });

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        savePreferences(selectedCategories);
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen h-full">
            {/* Left Column - Full height on mobile, then half width */}
            <div className="w-full md:w-1/2 bg-[#000000] flex flex-col items-center justify-center p-8 min-h-[50vh] md:min-h-screen">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-6 text-center">Select what you like</h1>
                    <p className="text-gray-600 mb-8 text-center">
                        Choose your interests to personalize your experience
                    </p>

                    {/* Selected Categories */}
                    {selectedCategories.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Your selections</h2>
                            <div className="flex flex-wrap gap-2">
                                {selectedCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => toggleCategory(category)}
                                        className="px-4 py-2 rounded-full bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600 transition-colors"
                                    >
                                        {category}
                                        <span className="text-sm">×</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isPending || selectedCategories.length === 0}
                        className={`w-full py-3 rounded-full text-white font-medium transition-colors ${
                            selectedCategories.length === 0
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {isPending ? "Saving..." : "Continue"}
                    </button>
                </div>
            </div>

            {/* Right Column - Full height on mobile, then half width */}
            <div className="w-full md:w-1/2 bg-[#000000] p-8 min-h-[50vh] md:min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6">Categories</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                className={`px-4 py-3 rounded-full text-center font-medium transition-all ${
                                    selectedCategories.includes(category)
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "bg-gray-800 text-white hover:bg-gray-200 hover:text-gray-950"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPreferences;
