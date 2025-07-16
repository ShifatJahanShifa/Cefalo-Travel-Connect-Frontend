import { useEffect, useState } from "react";
import { getNotificationsByUsername } from "../services/userService";
import { BellRing } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import type { notification } from "../types/notification";
import { markNotificationAsRead } from "../services/notificationService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { username } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getNotificationsByUsername(username!)
        data = data.filter(d => d.read === false && d.type === "plan_comment")
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOnClick = async (notification_id: string) => {
    try {
        await markNotificationAsRead(notification_id)
        toast.success("successfully marked as read")
        let data = await getNotificationsByUsername(username!)
        data = data.filter(d => d.read === false && d.type === "plan_comment")
        setNotifications(data);
    }
    catch(error)
    {
        console.error("Failed to mark notification:", error);
    }
  }

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">Notifications</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications found.</p>
      ) : (
        <ul className="space-y-4 max-w-2xl mx-auto">
          {notifications.map((notif) => (
            <li
              key={notif.notification_id}
              className={`p-4 rounded-xl shadow border ${
                notif.read ? "bg-slate-300" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    {new Date(notif.created_at!).toISOString().split("T")[0]}
                </span>
                <p className="text-gray-800">You have got notification for new travel plan comment. </p>
                <p className="text-gray-700">
                    
                    <Link
                        to={`/travelplans/${notif.reference_id}/comments`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        View 
                    </Link>
                </p>
                { !notif.read && (
                    <button className="bg-green-500 text-white p-2 rounded" onClick={() => handleOnClick(notif.notification_id!)}>mark as read</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
