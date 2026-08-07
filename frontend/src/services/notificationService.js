import api from "./api.js";

export const notificationService = {
  // Get all notifications
  async getNotifications() {
    const res = await api.get("/notifications");
    return res.data;
  },

  // Get unread notification count
  async getUnreadCount() {
    const res = await api.get("/notifications/unread-count");
    return res.data;
  },

  // Mark one notification as read
  async markAsRead(id) {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  // Mark all notifications as read
  async markAllAsRead() {
    const res = await api.put("/notifications/read-all");
    return res.data;
  },

  // Delete notification
  async deleteNotification(id) {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },

  // Create notification (Admin)
  async createNotification(data) {
    const res = await api.post("/notifications", data);
    return res.data;
  },
};