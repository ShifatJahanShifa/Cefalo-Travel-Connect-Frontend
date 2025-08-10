import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { deleteTravelPlan, getTravelPlanMembers } from "../services/travelPlanService";
import type { travelPlanOutput, travelPlanMember } from "../types/travelplan";
import { useEffect, useState } from "react";

interface Props {
  plan: travelPlanOutput;
  onDelete?: (travel_plan_id: string) => void;
}

export default function TravelPlanCard({ plan, onDelete }: Props) {
  const { user_id } = useAuth();
  const navigate = useNavigate();
  const isOwner = user_id === plan.planner_id;
  const [isEditor, setIsEditor] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<"creator" | "editor" | "member" | null>(null);


  useEffect(() => {
    const checkEditor = async () => {
      let members: travelPlanMember[];
      members = await getTravelPlanMembers(plan.travel_plan_id); 
 
      let member: travelPlanMember | undefined;
      if(members.length)
      {
        member= members!.find(m => m.user_id === user_id)
        if(member && member.travel_plan_member_role === 'editor') 
        {
          setIsEditor(true)
          setUserRole('editor')
        }
        else if(member) 
        {
          setUserRole('member')
        }
      }
      if(isOwner) 
      {
        setUserRole('creator')
      }
    } 

    checkEditor()
  },[])



  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this travel plan?")) {
      try {
        await deleteTravelPlan(plan.travel_plan_id);
        navigate("/travelplans");
        onDelete?.(plan.travel_plan_id);
      } catch (error) {
        console.error("Delete failed", error);
        alert("Something went wrong.");
      }
    }
  };

  return (
    <div className="relative bg-sky-100 border border-sky-200 rounded-2xl p-5 transition m-4 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex flex-row gap-5">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {plan.note || "Untitled Travel Plan"}
            </h3>
            {userRole && (
              <div className="relative bg-sky-600 text-white text-xs px-2 py-2 rounded shadow hover:bg-sky-900">
                {userRole.toUpperCase()}
              </div>
            )}
          </div>
          <p className=" text-black">
            From <b>{new Date(plan.start_date).toISOString().split("T")[0]}</b> To <b>{new Date(plan.end_date).toISOString().split("T")[0]}</b>
          </p>
          <p className=" text-black mt-1">
            Estimated Cost: <span className="font-medium text-gray-800">{plan.estimated_cost} BDT</span>
          </p>

          <br></br>

          {plan.places && plan.places.length>0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Places</h3>
            <ul className="list-disc ml-6 text-gray-800">
              {plan.places?.length && plan.places?.map((p, i) => (
                <li key={i}>
                  {p.place_name} (Latitude: {p.latitude}, Longitude: {p.longitude})
                </li>
              ))}
            </ul>
          </div> )}
  
          { plan.accommodations && plan.accommodations.length>0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Accommodations</h3>
            <ul className="list-disc ml-6 text-gray-700">
              {plan.accommodations?.length && plan.accommodations?.map((a, i) => (
                <li key={i}>
                  {a.accommodation_type} - {a.accommodation_name} (Latitude: {a.latitude},{" "}
                  Longitude: {a.longitude})
                </li>
              ))}
            </ul>
          </div>)}
  
          { plan.transports && plan.transports.length>0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Transports</h3>
            <ul className="list-disc ml-6 text-gray-800">
              {plan.transports?.length && plan.transports?.map((t, i) => (
                <li key={i}>
                  {t.transport_type} - {t.transport_name}
                </li>
              ))}
            </ul>
          </div>)} 
        </div>

        <div className="relative">
          <button className="text-gray-500 hover:text-gray-700 text-lg" onClick={() => setMenuOpen(!menuOpen)}>
            ⋮
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow z-20">
              <button
                onClick={() => navigate(`/travelplans/${plan.travel_plan_id}/view`)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                View
              </button>
              {(isOwner || isEditor) && (
                <>
                  <button
                    onClick={() =>
                      navigate(`/travelplans/${plan.travel_plan_id}/edit`, {
                        state: plan,
                      })
                    }
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Edit
                  </button> 
                </>
                )} 
                {(isOwner) && (
                  <>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-600"
                  >
                    Delete
                  </button>
                </> )}
            
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
