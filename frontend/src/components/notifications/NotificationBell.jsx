import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";
import { notificationService } from "../../services/notificationService";
import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "../../context/AuthContext.jsx";

function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);

  // Load notifications
  const loadNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.unread || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');
    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('🔌 Notification socket connected, joining room:', userId);
      socket.emit('joinRoom', userId);
    });

    socket.on('notification:new', (newNotification) => {
      console.log('🔔 New notification received:', newNotification);
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => socket.disconnect();
  }, [user?._id, user?.id]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary/10 transition"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          reload={loadNotifications}
          refreshCount={loadUnreadCount}
          close={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default NotificationBell;