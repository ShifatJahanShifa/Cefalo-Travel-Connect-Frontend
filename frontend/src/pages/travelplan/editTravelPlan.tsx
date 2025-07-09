import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TravelPlanForm from "./createTravelPlan";
import type { travelPlanInput, travelPlanOutput } from "../../types/travelplan";
import { getTravelPlanById, updateTravelPlan } from "../../services/travelPlanService";

export default function TravelPlanEditPage() {
    const { travel_plan_id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<travelPlanOutput>();

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getTravelPlanById(travel_plan_id!)
      setInitialData(data);
    } catch (err) {
      console.error("Failed to fetch post for editing:", err);
    }
  };
  fetchData();
}, [travel_plan_id]);

const handleUpdate = async (formData: any) => {
  try {
    await updateTravelPlan(travel_plan_id!, initialData!)
    navigate("/home");
  } catch (err) {
    console.error("Post update failed:", err);
    alert("Post update failed. Check console for details.");
  }
};

if (!initialData) return <p>Loading post...</p>;

return (
    <div className="p-4">
      <TravelPlanForm initialData={initialData} />
    </div>
  );
}

