import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-hot-toast";

const useFollow = () => {
    const queryClient = useQueryClient();
    const {mutate: follow, isPending} = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`/api/user/follow/${userId}`, {
                    method: "POST",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to follow user");
                return;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            // refetch the suggested users and auth user parallelly
            Promise.all([
                queryClient.invalidateQueries({queryKey: ["suggestedUsers"]}),
                queryClient.invalidateQueries({queryKey: ["authUser"]}),
            ]);
        },
        onError: () => {
            toast.error(error.message);
        },
    });
    return {follow, isPending};
};

export default useFollow;
