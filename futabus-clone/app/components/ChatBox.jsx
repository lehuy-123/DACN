"use client";
import { useState } from "react";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newChat = [...chat, { sender: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    setChat([...newChat, { sender: "ai", text: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-2xl shadow-lg flex flex-col border border-gray-200">
      <div className="bg-orange-500 text-white font-bold text-center py-2 rounded-t-2xl">
        🚍 Futa Chat AI
      </div>
      <div className="flex-1 overflow-y-auto p-2 h-80">
        {chat.map((m, i) => (
          <div key={i} className={`my-1 ${m.sender === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-3 py-2 rounded-xl ${
                m.sender === "user" ? "bg-orange-100" : "bg-gray-100"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
        {loading && <p className="text-gray-400 text-sm italic mt-2">Đang trả lời...</p>}
      </div>
      <form onSubmit={sendMessage} className="flex border-t p-2">
        <input
          className="flex-1 outline-none px-2 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hỏi AI về chuyến xe..."
        />
        <button className="bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600">
          Gửi
        </button>
      </form>
    </div>
  );
}
