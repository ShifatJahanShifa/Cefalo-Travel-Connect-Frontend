import { useEffect, useState } from "react";
import { getTravelPlans } from "../../services/travelPlanService";
import TravelPlanCard from "../../components/travelPlanCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { travelPlanOutput } from "../../types/travelplan";

export default function TravelPlanListPage() {
  const [plans, setPlans] = useState<travelPlanOutput[]>([]);
  const { user_id } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      const data = await getTravelPlans();
      setPlans(data);
    };
    fetchPlans();
  }, [user_id]);

  const handleDelete = (travel_plan_id: string) => {
    setPlans((prevPlans) =>
      prevPlans.filter((plan) => plan.travel_plan_id !== travel_plan_id)
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Explore Travel Plans</h2>
        <div className="flex gap-3">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            onClick={() => navigate("/travelplans/create")}
          >
            Create Travel Plan
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            onClick={() => navigate("/travelplans/invitations")}
          >
            View Invitations
          </button>
        </div>
      </div>

      {/* Travel Plan Cards */}
      <div className="space-y-6">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <TravelPlanCard
              key={plan.travel_plan_id}
              plan={plan}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-600">No travel plans available. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}