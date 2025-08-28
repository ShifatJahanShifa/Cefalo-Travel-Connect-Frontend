import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TravelPlanForm from "./createTravelPlan";
import type { travelPlanInput, travelPlanOutput } from "../../types/travelplan";
import { getTravelPlanById, updateTravelPlan } from "../../services/travelPlanService";
import { logger } from "../../utils/logger";

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
      logger.error("Failed to fetch post for editing:", err);
    }
  };
  fetchData();
}, [travel_plan_id]);


if (!initialData) return <p>Loading travel plan...</p>;

return (
    <div>
      <TravelPlanForm initialData={initialData} />
    </div>
  );
}

