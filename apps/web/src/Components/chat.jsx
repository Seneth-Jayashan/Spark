import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  Paper,
  Badge,
  useTheme,
} from "@mui/material";
import { io } from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";
import api from "../api/axios";
import EmojiPicker from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

const socket = io(import.meta.env.VITE_SERVER_URL);

export default function EventChat({ eventId, user_id, role }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
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
    if (isOwn) return theme.palette.primary.main; // your messages: blue
    if (msg?.sender_role === "organizer" || msg?.sender_role === "org_member") return "#FFB238"; // organization: gold
    if (msg?.sender_role === "volunteer") return theme.palette.grey[300]; // other volunteers: gray
    return theme.palette.grey[300];
  };
  const getTextColor = (msg) => {
    const bg = getMessageColor(msg);
    // Use theme contrast for colored bubbles, default text for gray
    if (bg === theme.palette.primary.main)
      return theme.palette.primary.contrastText;
    if (bg === "#FFD700") return theme.palette.getContrastText("#FFD700");
    return theme.palette.text.primary;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
      }}
    >
      {/* Chat Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          background: theme.palette.background.default,
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": { background: theme.palette.grey[200] },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "4px",
          },
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: theme.palette.text.secondary,
            }}
          >
            <Typography>No messages yet. Start the conversation!</Typography>
          </Box>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: getMessageAlignment(msg),
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "80%",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="flex-end"
                  justifyContent={getMessageAlignment(msg)}
                >
                  {getMessageAlignment(msg) === "flex-start" && (
                    <Tooltip title={msg.sender_name || msg.sender_role} arrow>
                      <Avatar
                        src={
                          msg.sender_avatar
                            ? `${import.meta.env.VITE_SERVER_URL}${msg.sender_avatar}`
                            : undefined
                        }
                        alt={msg.sender_name || msg.sender_role}
                        sx={{
                          bgcolor: theme.palette.secondary.main,
                          width: 32,
                          height: 32,
                          fontSize: "0.875rem",
                        }}
                      >
                        {getInitials(msg.sender_name || msg.sender_role)}
                      </Avatar>
                    </Tooltip>
                  )}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: getMessageColor(msg),
                      color: getTextColor(msg),
                      borderRadius:
                        getMessageAlignment(msg) === "flex-start"
                          ? "18px 18px 18px 4px"
                          : "18px 18px 4px 18px",
                      boxShadow: theme.shadows[1],
                    }}
                  >
                    {msg.sender_name && (
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.8, display: "block", mb: 0.5 }}
                      >
                        {msg.sender_name}
                      </Typography>
                    )}
                    <Typography variant="body2">{msg.message}</Typography>
                  </Box>
                  {getMessageAlignment(msg) === "flex-end" && (
                    <Tooltip title={msg.sender_name || msg.sender_role} arrow>
                      <Avatar
                        src={
                          msg.sender_avatar
                            ? `${import.meta.env.VITE_SERVER_URL}${msg.sender_avatar}`
                            : undefined
                        }
                        alt={msg.sender_name || msg.sender_role}
                        sx={{
                          bgcolor: theme.palette.info.main,
                          width: 32,
                          height: 32,
                          fontSize: "0.875rem",
                        }}
                      >
                        {getInitials(msg.sender_name || msg.sender_role)}
                      </Avatar>
                    </Tooltip>
                  )}
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    textAlign: getMessageAlignment(msg),
                    color: theme.palette.text.secondary,
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Box>
          ))
        )}

        {isTyping && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: theme.palette.grey[300],
                borderRadius: "18px 18px 18px 4px",
                display: "flex",
              }}
            >
              {[0, 0.2, 0.4].map((delay, i) => (
                <Box
                  key={i}
                  sx={{
                    width: "8px",
                    height: "8px",
                    bgcolor: theme.palette.grey[500],
                    borderRadius: "50%",
                    mr: i < 2 ? 0.5 : 0,
                    animation: "pulse 1.5s infinite ease-in-out",
                    animationDelay: `${delay}s`,
                    "@keyframes pulse": {
                      "0%,100%": { opacity: 0.3 },
                      "50%": { opacity: 1 },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Box */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {showEmojiPicker && (
          <Box
            sx={{
              position: "absolute",
              bottom: "60px", // just above input bar
              right: "10px",
              zIndex: 1000,
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Box>
        )}
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={4}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              backgroundColor: theme.palette.background.default,
            },
          }}
        />
        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <InsertEmoticonIcon />
        </IconButton>

        <Tooltip title="Send">
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!message.trim()}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
              "&:disabled": { backgroundColor: theme.palette.grey[300] },
            }}
          >
            <SendIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}
