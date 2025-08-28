import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getNotificationsByUsername } from "../../services/userService";
import { addTravelPlanMember } from "../../services/travelPlanService";
import { deleteNotification, markNotificationAsRead } from "../../services/notificationService";
import NotificationCard from "../../components/notificationCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logger } from "../../utils/logger";

export default function TravelPlanInvitationsPage() {
  const { user_id, username } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
          let data = await getNotificationsByUsername(username!);
         
          data = data.filter(d => d.read === false && d.type === "travel_plan_invitation")
          setInvitations(data);
     
      } catch (err) {
        logger.error("Failed to fetch invitations", err);
      } finally {
        setLoading(false);
      }
    };
   
    
    fetchInvitations();
  }, [username]);

  const handleAccept = async (notification: any) => {
    try {
      const payload = {
        travel_plan_id: notification.reference_id,
        user_id: user_id!,
        role: "member",
      };
      await addTravelPlanMember(notification.reference_id, payload);
      await markNotificationAsRead(notification.notification_id);
      toast.success("Successfully accepted invitation")
      setInvitations((prev) =>
        prev.filter((n) => n.notification_id !== notification.notification_id)
      );

    } catch (err) {
      logger.error("Failed to accept invitation", err);
    }
  };

  const handleDecline = async (notification_id: string) => {
    try {
      await deleteNotification(notification_id);
      setInvitations((prev) =>
        prev.filter((n) => n.notification_id !== notification_id)
      );
    } catch (err) {
      logger.error("Failed to decline invitation", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📩 Travel Plan Invitations</h2>
        <button
          onClick={() => navigate("/travelplans")}
          className="text-white bg-blue-600 p-2 rounded  text-md"
        >
         Back to Plans
        </button>
      </div>


      {loading && (
            <p className="text-gray-500">Loading invitations...</p>
        )}

        {!loading && invitations.length === 0 && (
            <p className="text-gray-500">No invitations found.</p>
        )}

        {!loading && invitations.length > 0 && (
            <div className="space-y-4">
            {invitations.map((notification) => (
                <NotificationCard
                key={notification.notification_id}
                notification={notification}
                onAccept={() => handleAccept(notification)}
                onDecline={() => handleDecline(notification.notification_id)}
                />
            ))}
            </div>
        )}
    </div>
  );
}
