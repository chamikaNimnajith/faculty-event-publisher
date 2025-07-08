import {useState} from "react";
import {Link} from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import {MdOutlineMail} from "react-icons/md";
import {MdPassword} from "react-icons/md";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const queryClient = useQueryClient();
    const {
        mutate: loginMutation,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({username, password}) => {
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({username, password}),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to login"); //default error message is "Failed to login"
                // return data; //to the success handler
            } catch (error) {
                throw new Error(error);
            }
        },

        onSuccess: () => {
            //toast.success("Login successful");
            queryClient.invalidateQueries({queryKey: ["authUser"]});
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation(formData);
    };

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (
        <div className="flex h-screen max-w-screen-xl mx-auto">
            <div className="flex-1 justify-center hidden items-center lg:flex">
                <XSvg className="fill-white lg:w-2/3" />
                {/* <img src="/pic.png" className="h-[350px] w-[350px] lg:w-2/3" /> */}
                <h1 className="text-6xl text-white font-extrabold lg:w-2/3">
                    <span className="">කැළණි</span> Events
                </h1>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <h1 className="text-4xl text-white font-extrabold lg:hidden">කැළණි Events</h1>
                    <XSvg className="w-24 fill-white lg:hidden" />
                    {/* <img src="/pic.png" className="h-[260px] w-[300px] lg:hidden" /> */}
                    <h1 className="text-4xl text-white font-extrabold">{"Let's"} go.</h1>
                    <label className="flex input input-bordered rounded gap-2 items-center">
                        <MdOutlineMail />
                        <input
                            type="text"
                            className="grow"
                            placeholder="username"
                            name="username"
                            onChange={handleInputChange}
                            value={formData.username}
                        />
                    </label>

                    <label className="flex input input-bordered rounded gap-2 items-center">
                        <MdPassword />
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button className="btn btn-primary rounded-full text-white">
                        {isPending ? "Loading..." : "Login"}
                    </button>
                    {isError && <p className="text-red-500">{error.message}</p>}
                </form>
                <div className="flex flex-col gap-2 mt-4">
                    <p className="text-lg text-white">{"Don't"} have an account?</p>
                    <Link to="/signup">
                        <button className="btn btn-outline btn-primary rounded-full text-white w-full">Sign up</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
