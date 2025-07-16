import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getRavelPlanComments, createTravelPlanComment, getTravelPlanMembers } from "../../services/travelPlanService";
import { useAuth } from "../../hooks/useAuth";
import type { travelPlanComment, travelPlanMember } from "../../types/travelplan";
import { createNotification } from "../../services/notificationService";
import { getUserInfo } from "../../utils/userInfo";

export default function TravelPlanDiscussion() {
  const { travel_plan_id } = useParams();
  const { user_id } = useAuth();

  const [comments, setComments] = useState<travelPlanComment[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [members, setMembers] = useState<travelPlanMember[]>();
  const [userDetails, setUserDetails] = useState<{ [userId: string]: { username: string; imageUrl: string } }>({});


  const fetchComments = async () => {
    try {
      const data = await getRavelPlanComments(travel_plan_id!);
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const members = await getTravelPlanMembers(travel_plan_id!);
      setMembers(members);
    } catch (error) {
      console.error("Failed to fetch travel plan members:", error);
    }
  };
 

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const payload: travelPlanComment = {
        travel_plan_id: travel_plan_id!,
        sender_id: user_id!,
        message: newMessage.trim(),
      };

      await createTravelPlanComment(travel_plan_id!, payload);
      setNewMessage("");
      fetchComments(); 
    } catch (err) {
      alert("Failed to send comment");
    }

    fetchMembers();
    if (!members || members.length === 0) return;

    try {
      await Promise.all(
        members
          .filter(member => member.user_id !== user_id)
          .map(member => {
            const notificationPayload = {
              user_id: member.user_id,
              type: "plan_comment",
              reference_id: travel_plan_id!,
            };
           
            return createNotification(notificationPayload);
          })
      );
    } catch (err) {
      console.error("Error sending notifications to members:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [travel_plan_id]);



  // useEffect(() => {
  //   const fetchUsernames = async () => {
  //     const newUsernames: { [key: string]: string } = {};
  //     for (const comment of comments) {
  //       const uid = comment.sender_id;
  //       if (!usernames[uid]) {
  //         const user = await getUserInfo(uid);
  //         if (user) 
  //         {

  //         }
  //       }
  //     }

  //     setUsernames((prev) => ({ ...prev, ...newUsernames }));
  //   };

  //   if (comments.length > 0) {
  //     fetchUsernames();
  //   }

  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [comments]);


  useEffect(() => {
  const fetchUserDetails = async () => {
    const newDetails: {
      [userId: string]: { username: string; imageUrl: string };
    } = {};

    for (const comment of comments) {
      const uid = comment.sender_id;
      if (!userDetails[uid]) {
        const user = await getUserInfo(uid);
        if (user) {
          newDetails[uid] = {
            username: user.username,
            imageUrl: user.profile_picture_url || `/images/none.jpg`, 
          };
        }
      }
    }

    setUserDetails((prev) => ({ ...prev, ...newDetails }));
  };

  if (comments.length > 0) {
    fetchUserDetails();
  }

  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [comments]);



  return (
    <div className="max-w-3xl mx-auto h-[90vh] border border-sky-400 flex flex-col p-6 bg-sky-100 mt-6 mb-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Group Discussion</h2>
        <p className="text-sm text-gray-500">Share ideas, plan details, and coordinate with your team.</p>
      </div>

     
      <div className="flex-1 overflow-y-auto space-y-4 bg-gray-50 border rounded p-4 shadow-inner">
        {loading ? (
          <p className="text-gray-500 italic">Loading messages...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 italic">No messages yet. Be the first to say something!</p>
        ) : (
          comments.map((c, idx) => ( 
            
            <div
              key={c.message_id || idx}
              className={`w-fit p-3 rounded-lg text-sm shadow transition-all ${
                c.sender_id === user_id
                  ? "ml-auto bg-blue-600 text-white rounded-br-none"
                  : "mr-auto bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {/* <p className={`text-xs mb-1 ${c.sender_id === user_id ? "text-blue-200" : "text-gray-500"}`}>
                {usernames[c.sender_id] ?? "Loading..."}
              </p> */}
              <p className={`text-xs mb-1 flex items-center gap-2 ${c.sender_id === user_id ? "text-blue-200" : "text-gray-500"}`}>
                {userDetails[c.sender_id]?.imageUrl && (
                  <img
                    src={userDetails[c.sender_id].imageUrl}
                    alt="Profile"
                    className="w-5 h-5 rounded-full"
                  />
                )}
                {userDetails[c.sender_id]?.username || "Unknown"}
              </p>

              <p>{c.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

     
      <div className="mt-4 border-t pt-4 flex gap-3 items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-sky-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
}
