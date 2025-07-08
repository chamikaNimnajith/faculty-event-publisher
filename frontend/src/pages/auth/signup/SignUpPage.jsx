import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";

import XSvg from "../../../components/svgs/X";

import {MdOutlineMail} from "react-icons/md";
import {FaUser} from "react-icons/fa";
import {MdPassword} from "react-icons/md";
import {MdDriveFileRenameOutline} from "react-icons/md";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });

    const {mutate, isError, isPending, error} = useMutation({
        mutationFn: async ({email, username, fullName, password}) => {
            try {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email, username, fullName, password}),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to create account");
                console.log(data);
                return data;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Account created successfully");
            navigate("/user-preferences"); // Redirect to preferences page
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault(); // prevent the form from submitting
        mutate(formData);
    };

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (
        <div className="flex h-screen max-w-screen-xl mx-auto px-10">
            <div className="flex-1 justify-center hidden items-center lg:flex">
                <XSvg className="fill-white lg:w-2/3" />
                <h1 className="text-6xl text-white font-extrabold lg:w-2/3">
                    <span className="">කැළණි</span> Events
                </h1>
                {/* <img src="/pic.png" className="lg:w-2/3" /> */}
            </div>
            <div className="flex flex-1 flex-col justify-center items-center">
                <form className="flex flex-col gap-4 lg:w-2/3 md:mx-20 mx-auto" onSubmit={handleSubmit}>
                    <XSvg className="w-24 fill-white lg:hidden" />
                    <h1 className="text-4xl text-white font-extrabold lg:hidden">කැළණි Events</h1>
                    {/* <img src="/pic.png" className="w-24 lg:hidden" /> */}
                    <h1 className="text-4xl text-white font-extrabold">Join today.</h1>
                    <label className="flex input input-bordered rounded gap-2 items-center">
                        <MdOutlineMail />
                        <input
                            type="email"
                            className="grow"
                            placeholder="Email"
                            name="email"
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex flex-1 input input-bordered rounded gap-2 items-center">
                            <FaUser />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Username"
                                name="username"
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className="flex flex-1 input input-bordered rounded gap-2 items-center">
                            <MdDriveFileRenameOutline />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Full Name"
                                name="fullName"
                                onChange={handleInputChange}
                                value={formData.fullName}
                            />
                        </label>
                    </div>
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
                        {isPending ? "Loading..." : "Sign up"}
                    </button>
                    {isError && <p className="text-red-500">{error.message}</p>}
                </form>
                <div className="flex flex-col gap-2 lg:w-2/3 mt-4">
                    <p className="text-lg text-white">Already have an account?</p>
                    <Link to="/login">
                        <button className="btn btn-outline btn-primary rounded-full text-white w-full">Sign in</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default SignUpPage;
