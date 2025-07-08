import {useState, useRef, useEffect} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {IoMdSend} from "react-icons/io";
import {RiChatNewLine} from "react-icons/ri";
import {MdOutlineClose} from "react-icons/md";

const ChatbotInterface = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [sessionId, setSessionId] = useState(null);
    const [conversation, setConversation] = useState([]);
    const messagesEndRef = useRef(null);
    const queryClient = useQueryClient();

    // Mutation for starting a chat session
    const {mutate: startSession} = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/chatbot/chat/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to start chat session");
            return data;
        },
        onSuccess: (data) => {
            setSessionId(data.sessionId);
            toast.success("Chat session started");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Mutation for sending a message
    const {mutate: sendMessage, isPending} = useMutation({
        mutationFn: async ({sessionId, message}) => {
            const res = await fetch("/api/chatbot/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({sessionId, message}),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send message");
            return data;
        },
        onSuccess: (data) => {
            setConversation((prev) => [...prev, {role: "assistant", content: data.answer, sources: data.sources}]);
            setMessage("");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Mutation for ending a chat session
    const {mutate: endSession} = useMutation({
        mutationFn: async ({sessionId}) => {
            const res = await fetch("/api/chatbot/chat/end", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({sessionId}),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to end chat session");
            return data;
        },
        onSuccess: () => {
            setSessionId(null);
            setConversation([]);
            toast.success("Chat session ended");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Add user message to conversation
        setConversation((prev) => [...prev, {role: "user", content: message}]);

        if (!sessionId) {
            // Start a new session if none exists
            startSession();
            // The actual message will be sent after session creation
            // You might want to queue the message or handle this differently
        } else {
            sendMessage({sessionId, message});
        }
    };

    const handleStartNewChat = () => {
        if (sessionId) {
            endSession({sessionId});
        }
        startSession();
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen && !sessionId) {
            startSession();
        }
    };

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [conversation]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Chat Assistant</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleStartNewChat}
                                className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                                title="New Chat"
                            >
                                <RiChatNewLine size={18} />
                            </button>
                            <button
                                onClick={toggleChat}
                                className="p-1 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                                title="Close Chat"
                            >
                                <MdOutlineClose size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto">
                        {conversation.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                Start a conversation with the assistant...
                            </div>
                        ) : (
                            conversation.map((msg, index) => (
                                <div key={index} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                    <div
                                        className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
                                            msg.role === "user"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                        }`}
                                    >
                                        {msg.content}
                                        {msg.role === "assistant" && msg.sources && (
                                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                {/* <p className="font-semibold">Sources:</p> */}
                                                <ul className="list-disc pl-4">
                                                    {msg.answer}
                                                    {/* {msg.sources.map((source, i) => (
                                                        <li key={i}>
                                                            {source.title} (score: {source.score})
                                                        </li>
                                                    ))} */}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                disabled={isPending}
                            />
                            <button
                                type="submit"
                                className="px-3 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                disabled={!message.trim() || isPending}
                            >
                                <IoMdSend size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={toggleChat}
                    className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ChatbotInterface;
