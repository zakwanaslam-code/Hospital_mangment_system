import { CheckCheck, X } from "lucide-react";
import { notificationService } from "../../services/notificationService";
import NotificationItem from "./NotificationItem";

function NotificationDropdown({
  notifications,
  reload,
  refreshCount,
  close,
}) {
  // ==========================
  // Mark All Read
  // ==========================
  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      reload();
      refreshCount();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b dark:border-slate-700">

        <div>
          <h3 className="font-bold text-lg">
            Notifications
          </h3>

          <p className="text-xs text-gray-500">
            {notifications.length} Notifications
          </p>
        </div>

        <button
          onClick={close}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-[450px] overflow-y-auto">

        {notifications.length === 0 ? (

          <div className="py-12 text-center text-gray-500">
            <div className="text-5xl mb-3">🔔</div>

            <h4 className="font-semibold">
              No Notifications
            </h4>

            <p className="text-sm mt-1">
              You're all caught up.
            </p>
          </div>

        ) : (

          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              reload={reload}
              refreshCount={refreshCount}
            />
          ))

        )}

      </div>

      {/* Footer */}

      {notifications.length > 0 && (
        <div className="border-t dark:border-slate-700 p-3">

          <button
            onClick={handleMarkAllRead}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition"
          >
            <CheckCheck size={18} />
            Mark All as Read
          </button>

        </div>
      )}

    </div>
  );
}

export default NotificationDropdown;