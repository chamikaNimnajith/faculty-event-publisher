import {Link} from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";
import {useQuery} from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";

const RightPanel = () => {
    const {data: suggestedUsers, isLoading} = useQuery({
        queryKey: ["suggestedUsers"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/user/suggested");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch suggested users");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    const {follow, isPending} = useFollow();

    if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;
    return (
        <div className="hidden lg:block my-0 mx-2 ">
            <div className="bg-[#16181C] p-4 rounded-md sticky top-6 h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                <p className="font-bold mb-4">Who to find</p>
                <div className="flex flex-col gap-4">
                    {/* item */}
                    {isLoading && (
                        <>
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                        </>
                    )}
                    {!isLoading &&
                        suggestedUsers?.map((user) => (
                            <Link
                                to={`/profile/${user.username}`}
                                className="flex items-center justify-between gap-4"
                                key={user._id}
                            >
                                <div className="flex rounded-full cursor-pointer duration-300 gap-3 hover:bg-stone-600 items-center max-w-fit pl-2 pr-4 py-0 transition-all">
                                    <div className="avatar">
                                        <div className="w-8 rounded-full">
                                            <img src={user.profileImage || "/avatar-placeholder.png"} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold tracking-tight truncate w-28">
                                            {user.fullName}
                                        </span>
                                        <span className="text-sm text-slate-500">@{user.username}</span>
                                    </div>
                                </div>
                                <div>
                                    {/* <button
                                        className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                                        onClick={(e) => {
                                            e.preventDefault(); // prevent go to the link
                                            follow(user._id);
                                        }}
                                    >
                                        {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                                    </button> */}
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};
export default RightPanel;
