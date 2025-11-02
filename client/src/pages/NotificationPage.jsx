import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, Bell } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Please login to see notifications");
        navigate("/login/student");
      } else {
        toast.error("Error fetching notifications");
      }
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      toast.error("Error marking as read");
      console.error("Error marking as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading)
    return (
      <p className="mt-10 text-center text-gray-400">
        Loading notifications...
      </p>
    );

  return (
    <div className="max-w-xl p-4 mx-auto mt-10 font-sans text-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="text-cyan-400" />
        <h2 className="text-xl font-semibold">Notifications</h2>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No new notifications</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif._id}
            className="flex items-center justify-between p-4 mb-3 transition-colors duration-200 bg-[#1e1e1e] border border-gray-700 rounded-lg hover:border-cyan-500"
          >
            <div>
              <p className="font-medium text-gray-100">{notif.message}</p>
              <small className="text-sm text-gray-400">
                Event: {notif.eventName || notif.eventId}
              </small>
            </div>
            <Check
              size={20}
              className="cursor-pointer text-cyan-400 hover:text-cyan-300"
              onClick={() => markAsRead(notif._id)}
              title="Mark as read"
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
