interface Props {
  notification: any;
  onAccept: () => void;
  onDecline: () => void;
};

import { Link } from "react-router-dom";

export default function NotificationCard({ notification, onAccept, onDecline }: Props) {
  
  return (
    <div className="bg-white border rounded p-4 shadow-xl mb-6 space-y-2">
      <h4 className="font-semibold text-md">Travel Plan Invitation</h4>
      <p className="text-gray-700">
          Travel plan:{" "}
          <Link
            to={`/travelplans/${notification.reference_id}/view`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            View Plan
          </Link>
      </p>

      <div className="flex gap-3 mt-2">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={onAccept}
        >
          Accept
        </button>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded"
          onClick={onDecline}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
