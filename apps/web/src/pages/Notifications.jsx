import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import api from '../api/axios';

// --- NEW HELPER COMPONENT ---
/**
 * Renders a message string, splitting it by newlines.
 * If a line contains " - ", it bolds the part before the dash.
 */
const BeautifulMessage = ({ message, className }) => {
  // Split the single message string into an array of lines
  const lines = message.split('\n');

  return (
    // Apply the base styling from the original <p> tag to this wrapper
    <div className={className}>
      {lines.map((line, index) => {
        // Try to split the line into a label and value
        const parts = line.split(' - ');

        // If it's a "Label - Value" line, style it
        if (parts.length === 2) {
          return (
            <span key={index} className="block"> {/* 'block' is like a <p> without margins */}
              <strong className="text-gray-900 font-medium">{parts[0]}</strong> - {parts[1]}
            </span>
          );
        }

        // Otherwise, just render the line (e.g., the first line)
        return (
          <span key={index} className="block">
            {line}
          </span>
        );
      })}
    </div>
  );
};
// --- END OF HELPER COMPONENT ---


export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications when the panel is opened
  useEffect(() => {
    if (isOpen) {
      fetchUserNotifications();
    }
  }, [isOpen]);

  const fetchUserNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications/me'); 
      setNotifications(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (id) => {
    // Mark as read in the UI immediately
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );

    // Call API to mark as read in the database
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error('Failed to mark as read:', err);
      // Optional: Revert UI state if API call fails
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* --- The Trigger Button (Bell Icon) --- */}
      <button
        onClick={togglePanel}
        className="relative bg-transparent border-none cursor-pointer text-2xl text-gray-800"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-1.5 py-0.5 text-xs font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* --- The Dark Overlay (closes panel on click) --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[999]"
          onClick={togglePanel}
        ></div>
      )}

      {/* --- The Slide-in Panel --- */}
      <div
        className={`fixed top-0 right-0 w-[350px] h-screen bg-white shadow-xl z-[1000] 
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* --- Panel Header --- */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold m-0">Notifications</h3>
          <button
            onClick={togglePanel}
            className="bg-transparent border-none text-3xl font-light cursor-pointer text-gray-500"
          >
            &times;
          </button>
        </div>

        {/* --- Panel Body (List) --- */}
        <div className="flex-grow overflow-y-auto">
          {loading && <p className="p-8 text-center text-gray-600">Loading...</p>}
          {error && <p className="p-8 text-center text-red-600">Error: {error}</p>}
          
          {!loading && !error && notifications.length === 0 && (
            <p className="p-8 text-center text-gray-600">You have no new notifications.</p>
          )}

          {!loading && !error && notifications.length > 0 && (
            <ul className="list-none p-0 m-0">
              {notifications.map(notif => (
                <li
                  key={notif._id}
                  className={`px-6 py-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50
                              ${!notif.isRead ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notif._id)}
                >
                  <strong className={`text-sm text-gray-800 ${!notif.isRead ? 'font-semibold' : 'font-medium'}`}>
                    {notif.title}
                  </strong>
                  
                  {/* --- THIS IS THE UPDATED PART --- */}
                  <BeautifulMessage 
                    message={notif.message}
                    className="text-sm text-gray-600 my-1 font-normal" 
                  />

                  <small className="text-xs text-gray-400 font-normal">
                    {new Date(notif.createdAt).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}