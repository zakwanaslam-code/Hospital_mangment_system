import {
  Calendar,
  UserPlus,
  AlertTriangle,
  FlaskConical,
  Pill,
  CreditCard,
  Bell,
  Trash2,
  Check,
} from "lucide-react";

import { notificationService } from "../../services/notificationService";

// ==========================
// Time Formatter
// ==========================
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const key in intervals) {
    const value = Math.floor(seconds / intervals[key]);

    if (value >= 1) {
      return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

// ==========================
// Notification Icon
// ==========================
const getIcon = (type) => {
  switch (type) {
    case "appointment":
      return <Calendar className="w-5 h-5 text-blue-500" />;

    case "patient":
      return <UserPlus className="w-5 h-5 text-green-500" />;

    case "emergency":
      return <AlertTriangle className="w-5 h-5 text-red-500" />;

    case "lab":
      return <FlaskConical className="w-5 h-5 text-purple-500" />;

    case "pharmacy":
      return <Pill className="w-5 h-5 text-emerald-500" />;

    case "billing":
      return <CreditCard className="w-5 h-5 text-yellow-500" />;

    default:
      return <Bell className="w-5 h-5 text-slate-500" />;
  }
};

function NotificationItem({
  notification,
  reload,
  refreshCount,
}) {
  // ==========================
  // Mark Read
  // ==========================
  const handleRead = async () => {
    if (notification.isRead) return;

    try {
      await notificationService.markAsRead(notification._id);

      reload();
      refreshCount();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // Delete
  // ==========================
  const handleDelete = async (e) => {
    e.stopPropagation();

    try {
      await notificationService.deleteNotification(notification._id);

      reload();
      refreshCount();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={handleRead}
      className={`relative flex gap-4 p-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 ${
        notification.isRead
          ? "bg-transparent"
          : "bg-blue-50 dark:bg-slate-800"
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {getIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4
            className={`font-semibold ${
              notification.isRead
                ? "text-slate-700 dark:text-slate-300"
                : "text-black dark:text-white"
            }`}
          >
            {notification.title}
          </h4>

          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <p className="text-sm text-slate-500 mt-1">
          {notification.message}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-slate-400">
            {timeAgo(notification.createdAt)}
          </span>

          {!notification.isRead && (
            <span className="flex items-center gap-1 text-blue-600 text-xs font-medium">
              <Check size={14} />
              New
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;