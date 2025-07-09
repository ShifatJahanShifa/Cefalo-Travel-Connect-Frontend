// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import TravelPlanCard from "../components/travelPlanCard";
// import type { travelPlanMember, travelPlanOutput } from "../types/travelplan";
// import { getTravelPlanById, getTravelPlanMembers, updateTravelPlanMemberRole } from "../services/travelPlanService";
// import { getUserByUsername } from "../services/userService";
// import { createNotiification } from "../services/notificationService";
// import { useAuth } from "../hooks/useAuth";

// export default function ViewTravelPlan() {
//     const { travel_plan_id } = useParams();
//     const navigate = useNavigate();
//     const [initialData, setInitialData] = useState<travelPlanOutput>();
//     const [showMembers, setShowMembers] = useState(false);
//     const [members, setMembers] = useState<travelPlanMember[]>();

//     const [showAddMemberForm, setShowAddMemberForm] = useState(false);
//     const [newMemberUsername, setNewMemberUsername] = useState("");
//     const [addMemberStatus, setAddMemberStatus] = useState("");

//     const { user_id } = useAuth();
//     const [selectedRoles, setSelectedRoles] = useState<{[key: string]: "member" | "editor";}>({});


//     useEffect(() => {
//         const fetchData = async () => {
//         try {
//             const data = await getTravelPlanById(travel_plan_id!);
//             setInitialData(data);
//         } catch (err) {
//             console.error("Failed to fetch travel plan:", err);
//         }
//         };
//         fetchData();

//         const fetchMembers = async() => {
//             try {
//                 const members = await getTravelPlanMembers(travel_plan_id!)
//                 setMembers(members)
//             }
//             catch(error) 
//             {
//                 console.error("Failed to fetch travel plan members:", error);
//             }
//         }
//         fetchMembers()
//     }, [travel_plan_id]);


//     if (!initialData) return <p>Loading...</p>;



//     const handleAddMember = async () => {
//         setAddMemberStatus("");
//         if (!newMemberUsername.trim()) {
//             setAddMemberStatus("Username cannot be empty.");
//             return;
//         }

//     try {
//             // Step 1: Get user info by username
//             const user = await getUserByUsername(newMemberUsername)

//             // Step 2: Construct notification payload
//             const notificationPayload = {
//             user_id: user.user_id,
//             type: "travel_plan_invitation",
//             reference_id: travel_plan_id!,
//             };

//             // Step 3: Send notification
//             const notificationResponse = await createNotiification(notificationPayload)

//             if (notificationResponse) 
//             {
//                 setAddMemberStatus(`Invitation sent to ${user.username}`);
//                 setNewMemberUsername("");
//             }
//         } catch (err: any) {
//             console.error(err);
//             setAddMemberStatus("Failed to add member or user not found.");
//         }
//     };


//     return (
//         <div className="p-6 max-w-4xl mx-auto space-y-6">
//         {/* Travel Plan Summary */}
//         <TravelPlanCard plan={initialData} onDelete={() => navigate("/home")} />

//         {/* 🔽 View Members Toggle Button */}
//         <button
//             onClick={() => setShowMembers((prev) => !prev)}
//             className="text-blue-600 underline"
//         >
//             {showMembers ? "Close Member List" : "View Members"}
//         </button>


//         {/* ➕ Add Member Toggle Button */}
//         <button
//         className="text-purple-600 underline ml-4"
//         onClick={() => setShowAddMemberForm((prev) => !prev)}
//         >
//         {showAddMemberForm ? "Close Add Member" : "Add Member"}
//         </button>

//         {showAddMemberForm && (
//         <div className="mt-4 bg-white border p-4 rounded shadow space-y-2">
//             <h4 className="font-semibold text-md">Add a Member by Username</h4>
//             <input
//             type="text"
//             placeholder="Enter username"
//             value={newMemberUsername}
//             onChange={(e) => setNewMemberUsername(e.target.value)}
//             className="border p-2 rounded w-full"
//             />
//             <button
//             onClick={handleAddMember}
//             className="bg-purple-600 text-white px-4 py-2 rounded"
//             >
//             Add
//             </button>
//             {addMemberStatus && (
//             <p className="text-sm text-gray-600 mt-1">{addMemberStatus}</p>
//             )}
//         </div>
//         )}

//         {showMembers && (
//             <div className="mt-2 bg-gray-50 border p-3 rounded">
//               <h4 className="font-semibold mb-2">Members</h4>
//               <ul className="space-y-4">
//                 {(members || []).map((m, i) => (
//                   <li key={i} className="border-b pb-2">
//                     <div>
//                       <strong>{m.username}</strong> — {m.travel_plan_member_role}<br />
//                       <span className="text-sm text-gray-600">{m.email}</span>
//                     </div>

//               {initialData?.planner_id === user_id && m.user_id !== user_id && (
//                 <div className="mt-2 flex gap-2 items-center">
//                   <select
//                     value={selectedRoles[m.user_id] || m.travel_plan_member_role}
//                     onChange={(e) =>
//                       setSelectedRoles((prev) => ({
//                         ...prev,
//                         [m.user_id]: e.target.value as "member" | "editor",
//                       }))
//                     }
//                     className="border px-2 py-1 rounded"
//                   >
//                     <option value="member">member</option>
//                     <option value="editor">editor</option>
//                   </select>
//                       <button
//                         onClick={async () => {
//                           try {
//                             const data = {
//                                 travel_plan_id: travel_plan_id,
//                                 user_id: m.user_id,
//                                 role: 'editor'
//                             }
//                             await updateTravelPlanMemberRole(
//                               travel_plan_id!,
//                               m.user_id,
//                               data
//                             );
//                             // Refresh members list
//                             const updatedMembers = await getTravelPlanMembers(travel_plan_id!);
//                             setMembers(updatedMembers);
//                           } catch (error) {
//                             console.error("Failed to update role", error);
//                           }
//                         }}
//                         className="bg-blue-500 text-white px-3 py-1 rounded"
//                       >
//                         Set Role
//                       </button>
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}


//         {/* 💬 Open Group Discussions */}
//         <button
//             className="text-green-600 underline"
//             onClick={() =>
//             navigate(`/travelplans/${travel_plan_id}/comments`, {
//                 state: { travel_plan_id },
//             })
//             }
//         >
//             Open Group Discussions
//         </button>

//         {/* You can also display more detail below if needed */}
//         <div>
//             <h3 className="font-bold text-lg mt-6">Places</h3>
//             <ul className="list-disc ml-4">
//             {initialData.places?.map((p, i) => (
//                 <li key={i}>
//                 {p.place_name} ({p.latitude}, {p.longitude})
//                 </li>
//             ))}
//             </ul>

//             <h3 className="font-bold text-lg mt-4">Accommodations</h3>
//             <ul className="list-disc ml-4">
//             {initialData.accommodations?.map((a, i) => (
//                 <li key={i}>
//                 {a.accommodation_type} - {a.accommodation_name} ({a.latitude}, {a.longitude})
//                 </li>
//             ))}
//             </ul>

//             <h3 className="font-bold text-lg mt-4">Transports</h3>
//             <ul className="list-disc ml-4">
//             {initialData.transports?.map((t, i) => (
//                 <li key={i}>
//                 {t.transport_type} - {t.transport_name}
//                 </li>
//             ))}
//             </ul>
//         </div>
//         </div>
//     );
// }




import { data, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TravelPlanCard from "../../components/travelPlanCard";
import type { travelPlanMember, travelPlanOutput } from "../../types/travelplan";
import {
  getTravelPlanById,
  getTravelPlanMembers,
  updateTravelPlanMemberRole,
} from "../../services/travelPlanService";
import { getUserByUsername } from "../../services/userService";
import { createNotiification } from "../../services/notificationService";
import { useAuth } from "../../hooks/useAuth";

export default function ViewTravelPlan() {
  const { travel_plan_id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<travelPlanOutput>();
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState<travelPlanMember[]>();
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [addMemberStatus, setAddMemberStatus] = useState("");
  const [isMember, setIsMember] = useState(false)

  const { user_id } = useAuth();
  const [selectedRoles, setSelectedRoles] = useState<{[key: string]: "member" | "editor";}>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTravelPlanById(travel_plan_id!);
        setInitialData(data);
      } catch (err) {
        console.error("Failed to fetch travel plan:", err);
      }
    };
    fetchData();

    const fetchMembers = async () => {
      try {
        const members = await getTravelPlanMembers(travel_plan_id!);
        setMembers(members);
        const memberExists = members.some(member => member.user_id === user_id);
        setIsMember(memberExists);
      } catch (error) {
        console.error("Failed to fetch travel plan members:", error);
      }
    };
    fetchMembers();
  }, [travel_plan_id]);

  if (!initialData) return <p>Loading...</p>;

  const handleAddMember = async () => {
    setAddMemberStatus("");
    if (!newMemberUsername.trim()) {
      setAddMemberStatus("Username cannot be empty.");
      return;
    }

    try {
      const user = await getUserByUsername(newMemberUsername);
      const notificationPayload = {
        user_id: user.user_id,
        type: "travel_plan_invitation",
        reference_id: travel_plan_id!,
      };

      const notificationResponse = await createNotiification(notificationPayload);

      if (notificationResponse) {
        setAddMemberStatus(`Invitation sent to ${user.username}`);
        setNewMemberUsername("");
      }
    } catch (err) {
      console.error(err);
      setAddMemberStatus("Failed to add member or user not found.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 bg-sky-100 border border-sky-400 mt-10 rounded-lg shadow-md">
      {/* Travel Plan Summary */}
      <TravelPlanCard plan={initialData} onDelete={() => navigate("/home")} />

      <div className="flex gap-4">
        <button
          onClick={() => setShowMembers((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showMembers ? "Hide Members" : "View Members"}
        </button>

        { (initialData.planner_id === user_id) && (
        <button
          onClick={() => setShowAddMemberForm((prev) => !prev)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          {showAddMemberForm ? "Cancel Add Member" : "Add Member"}
        </button>
        )}

        { isMember && (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-auto"
          onClick={() =>
            navigate(`/travelplans/${travel_plan_id}/comments`, {
              state: { travel_plan_id },
            })
          }
        >
          Open Group Discussions
        </button> 
        )}
      </div>

      {/* Add Member Form */}
      {showAddMemberForm && (
        <div className="bg-white border p-4 rounded shadow space-y-3">
          <h4 className="font-semibold text-lg text-black">Add Member</h4>
          <input
            type="text"
            placeholder="Enter username"
            value={newMemberUsername}
            onChange={(e) => setNewMemberUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            onClick={handleAddMember}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Send Invitation
          </button>
          {addMemberStatus && (
            <p className="text-sm text-gray-600 mt-1">{addMemberStatus}</p>
          )}
        </div>
      )}

      {/* Member List */}
      {showMembers && (
        <div className="bg-blue-50 border p-5 rounded shadow space-y-4">
          <h4 className="text-lg font-bold text-blue-800">Members</h4>
          {(members || []).map((m, i) => (
            <div key={i} className="border-b pb-3">
              <div>
                <strong className="text-xl">{m.username}</strong> <span className="bg-sky-500 px-1.5 py-1 text-white rounded-2xl">{m.travel_plan_member_role}</span>
                <div className="text-sm text-gray-500">{m.email}</div>
              </div>

              {/* Role Selector for Planner */}
              {initialData?.planner_id === user_id && m.user_id !== user_id && (
                <div className="mt-2 flex gap-2 items-center">
                  <select
                    value={selectedRoles[m.user_id] || m.travel_plan_member_role}
                    onChange={(e) =>
                      setSelectedRoles((prev) => ({
                        ...prev,
                        [m.user_id]: e.target.value as "member" | "editor",
                      }))
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="member">member</option>
                    <option value="editor">editor</option>
                  </select>
                  <button
                    onClick={async () => {
                      try {
                        const data = {
                                travel_plan_id: travel_plan_id,
                                user_id: m.user_id,
                                role: 'editor'
                            }
                        await updateTravelPlanMemberRole(
                          travel_plan_id!,
                          m.user_id,
                          data
                        
                        );
                        const updated = await getTravelPlanMembers(travel_plan_id!);
                        setMembers(updated);
                      } catch (err) {
                        console.error("Failed to update role", err);
                      }
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Update Role
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
