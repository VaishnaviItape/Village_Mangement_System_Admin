import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Loader2 } from "lucide-react";

export default function ChatBot() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! I am your AI Smart Village Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await axios.post("http://localhost:8080/api/chatbot", {
                message: userMsg.text
            });

            const botMsg = { sender: "bot", text: res.data.reply };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "❌ Error: Could not connect to the AI server." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-indigo-600 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-white font-bold text-lg">Village AI Assistant</h2>
                    <p className="text-indigo-100 text-xs">Powered by Google Gemini</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-6">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === "user" ? "bg-indigo-100" : "bg-indigo-600"}`}>
                                {msg.sender === "user" ? <User className="w-5 h-5 text-indigo-600" /> : <Bot className="w-5 h-5 text-white" />}
                            </div>

                            {/* Bubble */}
                            <div className={`p-4 rounded-2xl ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-br-none shadow-md" : "bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100"}`}>
                                <div className="whitespace-pre-wrap leading-relaxed text-sm font-medium">
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-end gap-2 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="p-4 rounded-2xl bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                <span className="text-sm font-medium text-slate-500">AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-center gap-3">
                    <input
                        className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-slate-700 outline-none transition-all"
                        placeholder="Ask about schemes, Gram Sabha meetings, or village expenses..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors shadow-sm"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
