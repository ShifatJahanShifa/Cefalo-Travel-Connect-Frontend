import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getNotificationsByUsername } from "../../services/userService";
import { addTravelPlanMember } from "../../services/travelPlanService";
import { deleteNotification, markNotificationAsRead } from "../../services/notificationService";
import NotificationCard from "../../components/notificationCard";
import { useNavigate } from "react-router-dom";

export default function TravelPlanInvitationsPage() {
  const { user_id, username } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
          let data = await getNotificationsByUsername(username!);
          console.log('look',data)
          data = data.filter(d => d.read === false)
          setInvitations(data);
     
      } catch (err) {
        console.error("Failed to fetch invitations", err);
      } finally {
        setLoading(false);
      }
    };
    console.log('a', invitations.length)
    
    fetchInvitations();
  }, [username]);

  const handleAccept = async (notif: any) => {
    try {
      const payload = {
        travel_plan_id: notif.reference_id,
        user_id: user_id!,
        role: "member",
      };
      await addTravelPlanMember(notif.reference_id, payload);
      await markNotificationAsRead(notif.notification_id);
      setInvitations((prev) =>
        prev.filter((n) => n.notification_id !== notif.notification_id)
      );
    } catch (err) {
      console.error("Failed to accept invitation", err);
    }
  };

  const handleDecline = async (notif_id: string) => {
    try {
      await deleteNotification(notif_id);
      setInvitations((prev) =>
        prev.filter((n) => n.notification_id !== notif_id)
      );
    } catch (err) {
      console.error("Failed to decline invitation", err);
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
            {invitations.map((notif) => (
                <NotificationCard
                key={notif.notification_id}
                notification={notif}
                onAccept={() => handleAccept(notif)}
                onDecline={() => handleDecline(notif.notification_id)}
                />
            ))}
            </div>
        )}
    </div>
  );
}
