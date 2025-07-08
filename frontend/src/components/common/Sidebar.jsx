import XSvg from "../svgs/X";
import {MdHomeFilled} from "react-icons/md";

import {CgMusicNote} from "react-icons/cg";
import {FaUser} from "react-icons/fa";
import {Link} from "react-router-dom";
import {BiLogOut} from "react-icons/bi";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTshirt} from "@fortawesome/free-solid-svg-icons";
import {faRing} from "@fortawesome/free-solid-svg-icons";
import {faCode} from "@fortawesome/free-solid-svg-icons";
import {MdOutlineSportsEsports} from "react-icons/md";
import {MdOutlineVolunteerActivism} from "react-icons/md";
import {AiOutlineLock} from "react-icons/ai";

const Sidebar = () => {
    const queryClient = useQueryClient();
    const {
        mutate: logout,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch("/api/auth/logout", {
                    method: "POST",
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to logout");
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            queryClient.setQueryData(["authUser"], null);
            queryClient.invalidateQueries({queryKey: ["authUser"]});
        },
        onError: () => {
            toast.error("Failed to logout");
        },
    });

    const {data: authUser} = useQuery({queryKey: ["authUser"]});

    return (
        <div className="w-18 max-w-52 md:flex-[2_2_0]">
            <div className="flex flex-col border-gray-700 border-r h-screen w-20 left-0 md:w-full sticky top-0">
                {/* <Link to="/" className="flex justify-center md:justify-start">
                    <XSvg className="h-16 w-16 fill-white hover:bg-stone-900 px-2" />
                </Link> */}
                <ul className="flex flex-col gap-3 mt-4">
                    <li className="flex justify-center md:justify-start">
                        <Link
                            to="/"
                            className="flex rounded-full cursor-pointer duration-300 gap-3 hover:bg-stone-900 items-center max-w-fit pl-2 pr-4 py-2 transition-all"
                        >
                            <MdHomeFilled className="h-8 w-8" />
                            <span className="text-lg hidden md:block">Home</span>
                        </Link>
                    </li>

                    {authUser.isAdmin === true && (
                        <li className="flex justify-center md:justify-start">
                            <Link
                                to={`/profile/${authUser?.username}`}
                                className="flex rounded-full cursor-pointer duration-300 gap-3 hover:bg-stone-900 items-center max-w-fit pl-2 pr-4 py-2 transition-all"
                            >
                                <FaUser className="h-6 w-6" />
                                <span className="text-lg hidden md:block">Profile</span>
                            </Link>
                        </li>
                    )}
                    <li className="flex justify-center md:justify-start">
                        <Link
                            to="/cording"
                            className="flex rounded-full cursor-pointer duration-300 gap-3 hover:bg-stone-900 items-center max-w-fit pl-2 pr-4 py-2 transition-all"
                        >
                            <FontAwesomeIcon icon={faCode} className="h-8 w-8" />
                            <span className="text-lg hidden md:block">Coding</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start">
                        <Link
                            to="/entertain"
                            className="flex rounded-full cursor-pointer duration-300 gap-3 hover:bg-stone-900 items-center max-w-fit pl-2 pr-4 py-2 transition-all"
                        >
                            <CgMusicNote className="h-8 w-8" />
                            <span className="text-lg hidden md:block">Entertain</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start">
                        <Link
                            to="/sports"
                            className="flex rounded-full cursor-pointer duration-300 gap-3 hover:bg-stone-900 items-center max-w-fit pl-2 pr-4 py-2 transition-all"
                        >
                            <MdOutlineSportsEsports className="h-8 w-8" />
                            <span className="text-lg hidden md:block">Sports</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start">
                        <Link
                            to="/volunteer"
                            className="flex rounded-full cursor-pointer duration-300 gap-3 hover:bg-stone-900 items-center max-w-fit pl-2 pr-4 py-2 transition-all"
                        >
                            <MdOutlineVolunteerActivism className="h-8 w-8" />
                            <span className="text-lg hidden md:block">Volunteer</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start">
                        <Link
                            to="/tshirts"
                            className="flex rounded-full cursor-pointer duration-300 gap-3 hover:bg-stone-900 items-center max-w-fit pl-2 pr-4 py-2 transition-all"
                        >
                            <FontAwesomeIcon icon={faTshirt} className="h-8 w-8" />
                            <span className="text-lg hidden md:block">Tshirts</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start">
                        <Link
                            to="/bangles"
                            className="flex rounded-full cursor-pointer duration-300 gap-3 hover:bg-stone-900 items-center max-w-fit pl-2 pr-4 py-2 transition-all"
                        >
                            <FontAwesomeIcon icon={faRing} className="h-8 w-8" />
                            <span className="text-lg hidden md:block">Bangles</span>
                        </Link>
                    </li>
                    {authUser && authUser.email === "rota@gmail.com" && (
                        <li className="flex justify-center md:justify-start">
                            <Link
                                to={"/admin"}
                                className="flex rounded-full cursor-pointer duration-300 gap-3 hover:bg-stone-900 items-center max-w-fit pl-2 pr-4 py-2 transition-all"
                            >
                                <AiOutlineLock className="h-8 w-8" />
                                <span className="text-lg hidden md:block">setAdmins</span>
                            </Link>
                        </li>
                    )}
                </ul>
                {authUser &&
                    (authUser.isAdmin === true ? (
                        <Link
                            to={`/profile/${authUser.username}`}
                            className="flex rounded-full duration-300 gap-2 hover:bg-[#181818] items-start mb-10 mt-auto px-4 py-2 transition-all"
                        >
                            <div className="avatar hidden md:inline-flex">
                                <div className="rounded-full w-8">
                                    <img src={authUser?.profileImage || "/avatar-placeholder.png"} />
                                </div>
                            </div>
                            <div className="flex flex-1 justify-between">
                                <div className="hidden md:block">
                                    <p className="text-sm text-white w-20 font-bold truncate">{authUser?.fullName}</p>
                                    <p className="text-slate-500 text-sm">@{authUser?.username}</p>
                                </div>
                                <BiLogOut
                                    className="h-5 w-5 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault(); //prevent default link behavior
                                        logout();
                                    }}
                                />
                            </div>
                        </Link>
                    ) : (
                        <Link className="flex rounded-full duration-300 gap-2 hover:bg-[#181818] items-start mb-10 mt-auto px-4 py-2 transition-all">
                            <div className="avatar hidden md:inline-flex">
                                <div className="rounded-full w-8">
                                    <img src={authUser?.profileImage || "/boy1.png"} />
                                </div>
                            </div>
                            <div className="flex flex-1 justify-between">
                                <div className="hidden md:block">
                                    <p className="text-sm text-white w-20 font-bold truncate">{authUser?.fullName}</p>
                                    {/* <p className="text-slate-500 text-sm">@{authUser?.username}</p> */}
                                </div>
                                <BiLogOut
                                    className="h-5 w-5 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault(); //prevent default link behavior
                                        logout();
                                    }}
                                />
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};
export default Sidebar;
