import React, { useState } from "react";
import axios from "axios";

export default function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        // 1. Add User Message
        const userMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput(""); // Clear input early for better UX

        try {
            // 2. Call API
            const res = await axios.post("http://localhost:8080/api/chatbot", {
                message: userMsg.text
            });

            // 3. Extract the 'reply' specifically
            const replyData = res.data.reply;

            let botText = "";

            // 4. Check if reply is an Array (SQL Rows) or String (Message)
            if (Array.isArray(replyData)) {
                // Convert array of objects to a readable string
                botText = JSON.stringify(replyData, null, 2);
            } else {
                botText = replyData;
            }

            const botMsg = { sender: "bot", text: botText };
            setMessages((prev) => [...prev, botMsg]);

        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "❌ Error: Could not connect to server." }
            ]);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>Village Assistant</div>
            <div style={styles.chatArea}>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            ...styles.message,
                            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                            backgroundColor: msg.sender === "user" ? "#007bff" : "#f1f0f0",
                            color: msg.sender === "user" ? "#fff" : "#000",
                        }}
                    >
                        {/* Use 'pre' tag to keep JSON formatting if it's data */}
                        <pre style={styles.preText}>{msg.text}</pre>
                    </div>
                ))}
            </div>
            <div style={styles.inputArea}>
                <input
                    style={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about schemes, users, bills..."
                />
                <button style={styles.button} onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

const styles = {
    container: { width: "400px", height: "600px", border: "1px solid #ccc", display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif", margin: "20px auto" },
    header: { padding: "15px", background: "#333", color: "#fff", textAlign: "center", fontWeight: "bold" },
    chatArea: { flex: 1, padding: "10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" },
    message: { padding: "10px", borderRadius: "10px", maxWidth: "85%" },
    preText: { margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "14px" },
    inputArea: { display: "flex", borderTop: "1px solid #eee" },
    input: { flex: 1, padding: "15px", border: "none", outline: "none" },
    button: { padding: "15px 20px", background: "#007bff", color: "#fff", border: "none", cursor: "pointer" }
};