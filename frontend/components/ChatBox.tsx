"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { formatAddress } from "@/lib/utils";

interface ChatMessage {
  address: string;
  text: string;
  timestamp: number;
}

interface ChatBoxProps {
  circleAddress: string;
}

export function ChatBox({ circleAddress }: ChatBoxProps) {
  const { address, isConnected } = useAccount();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnectedWS, setIsConnectedWS] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isConnected || !circleAddress) return;

    // Connect to WebSocket server
    const websocket = new WebSocket("ws://localhost:3002");

    websocket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnectedWS(true);
      // Join the circle chat room
      websocket.send(
        JSON.stringify({
          type: "join",
          circleAddress: circleAddress.toLowerCase(),
        })
      );
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "history") {
          setMessages(data.messages || []);
        } else if (data.type === "message") {
          setMessages((prev) => [...prev, data]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnectedWS(false);
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnectedWS(false);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [isConnected, circleAddress]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim() || !ws || !isConnectedWS || !address) return;

    const message = {
      type: "chat",
      circleAddress: circleAddress.toLowerCase(),
      address: address,
      text: inputText.trim(),
    };

    ws.send(JSON.stringify(message));
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Circle Chat</h3>
        <p className="text-gray-500">Connect your wallet to join the chat</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Circle Chat</h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnectedWS ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-500">
            {isConnectedWS ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, idx) => {
            const isOwnMessage = msg.address.toLowerCase() === address?.toLowerCase();
            return (
              <div
                key={idx}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isOwnMessage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {isOwnMessage ? "You" : formatAddress(msg.address)}
                  </div>
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {msg.text}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnectedWS}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnectedWS || !inputText.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
