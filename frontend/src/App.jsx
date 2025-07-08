import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import CordingPage from "./pages/home/CordingPage";
import Entertain from "./pages/home/Entertain";
import Sports from "./pages/home/Sports";
import Volunteer from "./pages/home/Volunteer";
import Tshirts from "./pages/home/Tshirts";
import Bangles from "./pages/home/Bangles";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import ProfilePage from "./pages/profile/ProfilePage";
import {Toaster} from "react-hot-toast";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import AdminPage from "./pages/AdminPage";
import UserPreferences from "./pages/auth/signup/UserPreferences";
import {useEffect} from "react";
import ChatbotInterface from "./components/common/ChatbotInterface";

const publicVapidKey = "BCN4DSpqvv11Dl8cfe4RyuqoWmzybSeE95SXCnBI6Up0FXGQvGKarXMsS1UdCINCXWPchdR9R6Tv6QBInt1XZOE";

const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

function App() {
    useEffect(() => {
        const registerServiceWorker = async () => {
            try {
                if (!("serviceWorker" in navigator)) {
                    console.warn("Service workers are not supported");
                    return;
                }

                const registration = await navigator.serviceWorker.register("/sw.js");
                console.log("Service Worker Registered");

                // Check if push manager is available
                if (!("PushManager" in window)) {
                    console.warn("Push messaging is not supported");
                    return;
                }

                // Check current subscription
                let subscription = await registration.pushManager.getSubscription();

                // Subscribe only if not already subscribed
                if (!subscription) {
                    subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                    });
                    console.log("Subscribed:", subscription);
                }

                // Send subscription to server
                await fetch("/api/subscription/savesubscription", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(subscription),
                });
            } catch (error) {
                console.error("Error during service worker registration:", error);
            }
        };

        registerServiceWorker();
    }, []);

    const {
        data: authUser,
        isLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch user");

                console.log("auth user is here:", data);
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        retry: false, //just one time fetch (default is three times)
    });

    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex max-w-5xl mx-auto">
            {/* common components.because it's not wrap with Routes */}
            {authUser && <Sidebar />}
            <Routes>
                <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/admin" element={authUser ? <AdminPage /> : <Navigate to="/" />} />
                <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/user-preferences" />} />
                <Route path="/user-preferences" element={<UserPreferences />} />

                <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
                <Route path="/cording" element={authUser ? <CordingPage /> : <Navigate to="/login" />} />
                <Route path="/entertain" element={authUser ? <Entertain /> : <Navigate to="/login" />} />
                <Route path="/sports" element={authUser ? <Sports /> : <Navigate to="/login" />} />
                <Route path="/volunteer" element={authUser ? <Volunteer /> : <Navigate to="/login" />} />
                <Route path="/tshirts" element={authUser ? <Tshirts /> : <Navigate to="/login" />} />
                <Route path="/bangles" element={authUser ? <Bangles /> : <Navigate to="/login" />} />
            </Routes>
            {authUser && <RightPanel />}
            <ChatbotInterface />
            <Toaster />
        </div>
    );
}

export default App;
