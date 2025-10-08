import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import api from "../api/axios";
import EmojiPicker from "emoji-picker-react";
import { 
  FaPaperPlane, 
  FaSmile, 
  FaUser, 
  FaCrown,
  FaUserTie,
  FaSpinner
} from "react-icons/fa";

const socket = io(import.meta.env.VITE_SERVER_URL);

export default function EventChat({ eventId, user_id, role }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  useEffect(() => {
    if (!eventId) return;

    socket.emit("join_event", { eventId: String(eventId) });

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${eventId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    };
    fetchMessages();

    socket.on("receive_message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );
    socket.on("typing", ({ isTyping, senderId }) => {
      if (senderId !== socket.id) setIsTyping(isTyping);
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [eventId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    const payload = {
      eventId: String(eventId),
      sender_id: user_id,
      sender_role: role,
      message: message.trim(),
    };
    socket.emit("send_message", payload);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", {
      eventId: String(eventId),
      isTyping: e.target.value.length > 0,
    });
  };

  const getInitials = (name) => name?.[0]?.toUpperCase() || "U";
  const isOwnMessage = (msg) => String(msg?.sender_id) === String(user_id);
  const getMessageAlignment = (msg) =>
    isOwnMessage(msg) ? "flex-end" : "flex-start";
  
  const getMessageColor = (msg) => {
    const isOwn = isOwnMessage(msg);
    if (isOwn) return "bg-blue-900 text-white"; // your messages: blue
    if (msg?.sender_role === "organizer" || msg?.sender_role === "org_member") return "bg-[#FFB238] text-blue-900"; // organization: gold
    if (msg?.sender_role === "volunteer") return "bg-gray-200 text-gray-800"; // other volunteers: gray
    return "bg-gray-200 text-gray-800";
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "organizer":
      case "org_member":
        return <FaCrown className="text-[#FFB238] text-xs" />;
      case "admin":
        return <FaUserTie className="text-blue-900 text-xs" />;
      default:
        return <FaUser className="text-gray-600 text-xs" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-amber-50">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-200">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPaperPlane className="text-blue-900 text-xl" />
              </div>
              <p className="text-gray-600 font-medium">No messages yet</p>
              <p className="text-gray-500 text-sm">Start the conversation!</p>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex ${getMessageAlignment(msg) === "flex-end" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div className="flex flex-col max-w-[80%]">
                  <div className={`flex items-end gap-2 ${getMessageAlignment(msg) === "flex-end" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-amber-100 flex items-center justify-center border-2 border-white shadow-sm">
                        {msg.sender_avatar ? (
                          <img
                            src={`${import.meta.env.VITE_SERVER_URL}${msg.sender_avatar}`}
                            alt={msg.sender_name || msg.sender_role}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-blue-900">
                            {getInitials(msg.sender_name || msg.sender_role)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message Bubble */}
                    <div className="flex flex-col">
                      {msg.sender_name && (
                        <div className={`flex items-center gap-1 mb-1 ${getMessageAlignment(msg) === "flex-end" ? "justify-end" : "justify-start"}`}>
                          <span className="text-xs font-medium text-gray-600">
                            {msg.sender_name}
                          </span>
                          {getRoleIcon(msg.sender_role)}
                        </div>
                      )}
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`px-4 py-2 rounded-2xl shadow-sm ${getMessageColor(msg)} ${
                          getMessageAlignment(msg) === "flex-start"
                            ? "rounded-bl-md"
                            : "rounded-br-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">
                          {msg.message}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`mt-1 ${getMessageAlignment(msg) === "flex-end" ? "text-right" : "text-left"}`}>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-start mb-4"
          >
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <FaSpinner className="text-gray-500 text-xs animate-spin" />
              </div>
              <div className="px-4 py-2 bg-gray-200 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: delay,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="relative border-t border-gray-200 bg-white p-4">
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 right-4 z-50"
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </motion.div>
        )}
        
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
              rows={1}
              style={{
                minHeight: "48px",
                maxHeight: "120px",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-3 text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors duration-200"
          >
            <FaSmile className="text-lg" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              message.trim()
                ? "bg-blue-900 text-white hover:bg-blue-800 shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaPaperPlane className="text-lg" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
