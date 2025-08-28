import type { getWishlistType, groupedUsers } from "../../types/wishlist";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWishlistById, getInterestedUsers, toggleVisibility } from "../../services/wishlistService";
import { useAuth } from "../../hooks/useAuth";
import { createProximity, getProximityByUsername, updateProximity, deleteProximity } from "../../services/proximityService";
import { Link } from "react-router-dom";
import { createNotification } from "../../services/notificationService";
import { getTravelPlansByUsername } from "../../services/userService";
import { useProximity } from "../../hooks/useProximity";
import { toast } from "react-toastify";
import { getTravelPlanMembers } from "../../services/travelPlanService";
import { logger } from "../../utils/logger";
import { formatDateString } from "../../utils/dateStringFormatter";


export default function ViewWishlistPage() {
  const { wishlist_id } = useParams();
  const [wishlist, setWishlist] = useState<getWishlistType | null>(null);
  const location = useLocation();
  const { user_id, username } = useAuth();

  const [interestedUsers, setInterestedUsers] = useState<groupedUsers[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showRadiusInput, setShowRadiusInput] = useState(false);
  const [radius, setRadius] = useState("");
  const [radiusStatus, setRadiusStatus] = useState("");
  const [hasExistingRadius, setHasExistingRadius] = useState(false);
  const [isPublic, setIsPublic] = useState(false)

  const [selectedUser, setSelectedUser] = useState<groupedUsers | null>(null);
  const [showTravelPlanModal, setShowTravelPlanModal] = useState(false);
  const [travelPlans, setTravelPlans] = useState<any[]>([]);
  const [userTravelMembership, setUserTravelMembership] = useState<{ [travelPlanId: string]: boolean }>({});

  const [unsetNotif, setUnsetNotif] = useState(true)


  const { proximityEnabled, setProximityEnabled } = useProximity()
  
  const navigate = useNavigate()
  const data = location.state as getWishlistType;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const result = await getWishlistById(wishlist_id!);
        setWishlist(result);
        setIsPublic(result.is_public)
      } catch (err) {
        logger.error("Error fetching post:", err);
      }
    };

    const fetchProximity = async () => {
      try {
        let proximity = await getProximityByUsername(username!);
        proximity = proximity.filter(p => p.reference_id === wishlist_id);
        if (proximity.length > 0 && proximity[0].radius) {
          
          setHasExistingRadius(true);
          setRadius((proximity[0].radius).toString());
        } else {
          setHasExistingRadius(false);
        }
      } 
      catch (err) {
        logger.warn("No existing radius found for this wishlist.");
        setHasExistingRadius(false);
      }
    };

    fetchWishlist();
    fetchProximity();
  }, [user_id, wishlist_id]);

  if (!wishlist) return <p className="text-center text-gray-500">Loading...</p>;

  const handleFetchInterestedUsers = async () => {

    if (showUsers) {
      setShowUsers(false);
      return;
    }

    try {
      let users = await getInterestedUsers(wishlist.theme);
      users = users.filter(user => user.user_id !== user_id)
      setInterestedUsers(users);
      setShowUsers(true);
    } catch (err) {
      setInterestedUsers([]);
      setShowUsers(prev => !prev);
      logger.error("Failed to fetch interested users", err);
    }
  };

  const handleSetRadius = async () => {
    if (!radius.trim()) return;
    const data = {
      user_id: user_id!,
      type: "wishlist",
      reference_id: wishlist_id!,
      radius: parseFloat(radius)
    };
    if(!hasExistingRadius){
      try {
        await createProximity(data);
        // setRadiusStatus("Alert radius set successfully!");
        toast.success("Successfully set alert radius");
        setHasExistingRadius(true);
        setRadius(radius);
        setShowRadiusInput(false);
        setProximityEnabled(true);
        setUnsetNotif(false)
      } 
      catch (err) {
        logger.error("Failed to set alert radius", err);
        setRadiusStatus("Failed to set alert.");
        toast.error("Failed to set alert radius");
      }
    }
    else 
    {
      try {
        await updateProximity(data);
        // setRadiusStatus("Alert radius updated successfully!");
        toast.success("Successfully updated alert radius");
        setHasExistingRadius(true);
        setRadius(radius);
        setShowRadiusInput(false);
      } catch (err) {
        logger.error("Failed to set alert radius", err);
        setRadiusStatus("Failed to set alert.");
        toast.error("Failed to update alert radius");
      }
    }
  }

  const handleDelete = async () => {
    const data = {
      user_id: user_id!,
      type: "wishlist",
      reference_id: wishlist_id!,
      radius: parseFloat(radius)
    };
    try {
      await deleteProximity(data)
      toast.success("Successfully unset proximity alert radius")
      setProximityEnabled(false)
      setHasExistingRadius(false);
      setRadius("");
      setShowRadiusInput(false);
    }
    catch (err: any) 
    {
      logger.error("Failed to unset alert radius", err);
    }
  }
  const handleCancelUpdate = async () => {
    setShowRadiusInput(false)
  }

  const handleVisibility = async () => {
    try {
      const result = await toggleVisibility(wishlist.wishlist_id)
      setIsPublic(!wishlist.is_public)
      toast.success(`Sucessfully made it ${isPublic ? "private" : "public"}`)
    }
    catch (error: any) 
    {
      logger.error("Failed to toggle visibility", error);
    }
  }

  const travelPlanMember = async (travel_plan_id: string) => {
    try 
    {
      return await getTravelPlanMembers(travel_plan_id)
    }
    catch(error: any)
    {
      logger.error(error)
    }
  }


 

  const handleOpenTravelPlanModal = async (user: groupedUsers) => {
  try {
    setSelectedUser(user);
    const data = await getTravelPlansByUsername(username!);

    const userMembershipMap: { [travelPlanId: string]: boolean } = {};

    for (const d of data) {
      const members = await travelPlanMember(d.travel_plan_id);

  
      const isMember = members?.some(member => member.username === user.username);
      userMembershipMap[d.travel_plan_id] = isMember || false;
    }

   
    setTravelPlans(data);
    setUserTravelMembership(userMembershipMap); 
    setShowTravelPlanModal(true);
  } catch (err) {
    logger.error("Failed to load travel plans", err);
  }
};


const handleSendInvitation = async (targetUserId: string, travel_plan_id: string) => {
   try {
        const notificationPayload = {
          user_id: targetUserId,
          type: "travel_plan_invitation",
          reference_id: travel_plan_id!,
        };
  
        const notificationResponse = await createNotification(notificationPayload);
        toast.success("Successfully sent invitation")
      } catch (err) {
        logger.error(err);
        
      }
};


  return (
    <div className="p-6 max-w-3xl mx-auto bg-sky-100 rounded border border-sky-400 mt-10 mb-10 shadow-xl space-y-10">
      <div className="flex flex-row gap-10 justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{wishlist.title}</h1>
        <span className="bg-green-500 px-2 py-2 hover:bg-green-600 rounded-2xl text-white"> { wishlist.is_public ? "Public" : "Private"}</span>
      </div>

      <div className="grid grid-cols-1  gap-4">
        <p><span className="font-semibold">Place:</span> {wishlist.place_name}</p>
        <p><span className="font-semibold">Latitude:</span> {wishlist.place_latitude}</p>
        <p><span className="font-semibold">Longitude:</span> {wishlist.place_longitude}</p>
        <p><span className="font-semibold">Theme:</span> {wishlist.theme}</p>
        <p><span className="font-semibold">Region:</span> {wishlist.region}</p>
        <p><span className="font-semibold">Note:</span> {wishlist.note}</p>
      </div>

      {wishlist.user_id === user_id && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={handleFetchInterestedUsers}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {showUsers ? "Hide Interested Users" : "View Interested Users"}
            </button>

            <button
              onClick={() => setShowRadiusInput((prev) => !prev)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {hasExistingRadius ? "Update Alert Radius" : "Set Alert Radius"}
            </button>

            {hasExistingRadius && (
              <button 
              onClick={handleDelete} 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" 
              >
                Unset Alert Radius
              </button>
            )}
            <button
              onClick={handleVisibility}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
            { isPublic ? "Make it Private" : "Make it Public"}
            </button>
          </div>

          {showUsers && (
            <div className="bg-gray-50 border p-4 rounded">
              <h4 className="font-semibold text-lg mb-3">Interested Users</h4>
              {interestedUsers.length === 0 ? (
                <p className="text-sm text-gray-600">No interested users found.</p>
              ) : (
                <div className="list-disc list-inside space-y-1">
               
                  {interestedUsers.map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 border border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={user.profile_picture_url || `/images/none.jpg`}
                        alt={`${user.username}'s profile`}
                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                      />
                      <div className="flex flex-col flex-grow">
                        <h3 className="text-md font-semibold text-gray-800">{user.username}</h3>
                        <p className="text-sm text-gray-800">{user.email}</p>
                        {/* <p className="text-sm text-gray-800">Wishlist ID: {user.wishlist_id}</p> */}
                        <p className="text-gray-700">
                         
                          <Link
                            to={`/wishlists/${user.wishlist_id}/view`}
                            className="text-blue-600  hover:text-blue-800"
                          >
                            View Wishlist
                          </Link>
                      </p>

                      </div>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleOpenTravelPlanModal(user)}
                      >
                        Add to Travel Plan
                      </button>
                    </div>
                  ))}

                </div>
              )}
            </div>
          )}

          {showRadiusInput && (
            <div className="bg-white border p-4 rounded space-y-2">
              <label className="block font-medium">Enter Alert radius (in km):</label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <div className="flex flex-row gap-10">
              <button
                onClick={handleSetRadius}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Set Radius
              </button>
              <button
                onClick={handleCancelUpdate}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cancel
              </button>
              </div>
              {radiusStatus && <p className="text-sm text-gray-700">{radiusStatus}</p>}

            </div>
          )}


        {showTravelPlanModal && selectedUser && (
          <div className="absolute bottom-20 z-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4 border border-gray-300">
              <h2 className="text-lg font-semibold text-blue-700">Select a Travel Plan</h2>

              {travelPlans.length > 0 ? (
                <ul className="space-y-3 max-h-60 overflow-y-auto">
                {travelPlans.map((plan) => {
                  const isMember = userTravelMembership[plan.travel_plan_id];

                  return (
                    <li
                      key={plan.travel_plan_id}
                      className={`border border-gray-300 p-3 rounded cursor-pointer hover:bg-blue-50 transition
                        ${isMember ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100" : ""}
                      `}
                      onClick={() => {
                        if (!isMember) {
                          handleSendInvitation(selectedUser.user_id, plan.travel_plan_id);
                        }
                      }}
                    >
                      <p><strong>Note:</strong> {plan.note}</p>
                      <p><strong>Start Date:</strong> {formatDateString(plan.start_date)}</p>
                      <p><strong>End Date:</strong> {formatDateString(plan.end_date)}</p>
                      {isMember && (
                        <span className="text-red-500 font-semibold">Already a member</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              ) : (
                <p className="text-sm text-gray-500">No travel plans found.</p>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => navigate("/travelplans/create")}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Create Travel Plan
                </button>
                <button
                  onClick={() => setShowTravelPlanModal(false)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}



        </div>
      )}
    </div>
  );
}
