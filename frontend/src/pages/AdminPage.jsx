import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";

const fetchUsers = async () => {
    const res = await fetch(`/api/user/allusers`);
    const data = await res.json();
    console.log("data from fetchUsers", data);
    if (!res.ok) throw new Error(data.error || "Failed to fetch users");
    return data;
};

const setAdmin = async (userId) => {
    const res = await fetch(`/api/user/setadmin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userId}),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to set admin status");
    return data;
};

const UsersTable = () => {
    const queryClient = useQueryClient();
    const {
        data: users,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["allUsers"],
        queryFn: fetchUsers,
        keepPreviousData: true,
    });

    // Mutation to set admin
    const mutation = useMutation({
        mutationFn: setAdmin,
        onSuccess: () => {
            alert("User promoted to admin successfully!");
            queryClient.invalidateQueries({queryKey: ["allUsers"]});
        },
        onError: (err) => {
            alert(`Failed to set admin: ${err.message}`);
        },
    });

    if (isLoading) return <div className="p-4 text-center">Loading...</div>;
    if (isError) return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;
    if (!users?.length) return <div className="p-4 text-center">No users found.</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Users</h2>
            </div>

            <table className="w-full border-collapse border border-gray-700">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="p-2 border border-gray-700">Username</th>
                        <th className="p-2 border border-gray-700">isAdmin</th>
                        <th className="p-2 border border-gray-700">Email</th>
                        <th className="p-2 border border-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-100">
                            <td className="p-2 border border-gray-700">{user.username}</td>
                            <td className="p-2 border border-gray-700">{user.isAdmin ? "Yes" : "No"}</td>
                            <td className="p-2 border border-gray-700">{user.email}</td>
                            <td className="p-2 border border-gray-700 text-center">
                                <button
                                    onClick={() => mutation.mutate(user._id)}
                                    disabled={mutation.isLoading}
                                    className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-400"
                                >
                                    {mutation.isLoading ? "Processing..." : "Set Admin"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AdminPage = () => {
    return (
        <div>
            <UsersTable />
        </div>
    );
};

export default AdminPage;
