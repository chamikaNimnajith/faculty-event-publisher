import {useState} from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import {useQuery} from "@tanstack/react-query";

const Bangles = () => {
    const [feedType, setFeedType] = useState("bangles");
    const {data: authUser} = useQuery({queryKey: ["authUser"]});

    return (
        <>
            <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
                {/* Header */}
                <div className="flex w-full border-b border-gray-700">
                    <div
                        className={
                            "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                        }
                        onClick={() => setFeedType("bangles")}
                    >
                        Bangles
                        {feedType === "bangles" && (
                            <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
                        )}
                    </div>
                    <div
                        className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                        onClick={() => setFeedType("following")}
                    >
                        Following
                        {feedType === "following" && (
                            <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
                        )}
                    </div>
                </div>

                {/*  CREATE POST INPUT */}
                {authUser?.isAdmin === true && <CreatePost />}

                {/* POSTS */}
                <Posts feedType={feedType} />
            </div>
        </>
    );
};
export default Bangles;
