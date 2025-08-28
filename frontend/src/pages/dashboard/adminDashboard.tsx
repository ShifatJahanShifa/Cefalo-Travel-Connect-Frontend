import { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser } from "../../services/userService";
import { getPlaces, createPlace, updatePlace } from "../../services/placeService";
import { getAccommodations, createAccommodation, updateAccommodation } from "../../services/accommodationService";
import { getRestaurants, createRestaurant, updateRestaurant } from "../../services/restaurantService";
import { getTransports, createTransport, updateTransport } from "../../services/transportService";
import type { getUser } from "../../types/user";
import type { placeCreation, placeUpdation, placeDTOType } from "../../types/place";
import type { accommodationCreation, accommodationDTOType, accommodationUpdation } from "../../types/accommodation";
import type { transportCreation, transportUpdation, getTransport } from "../../types/transport";
import type { restaurantCreation, restaurantUpdation, restaurantDTOType } from "../../types/restaurant";
import { logger } from "../../utils/logger";
import type { adminDashboardFormType, adminDashboardServiceType } from "../../types/adminDashboard";

import {
  AdminDashboardTabs,
  AdminDashboardServices,
  AdminDashboardServiceMode,
} from "../../constants/adminDashboard";
import { formatDateString } from "../../utils/dateStringFormatter";

// import type {
//   AdminDashboardTabs as AdminDashboardTabsType,
//   AdminDashboardServices as AdminDashboardServicesType,
//   AdminDashboardServiceMode as AdminDashboardServiceModeType,
// } from "../../constants/adminDashboard";



export default function AdminDashboard() {

  const [users, setUsers] = useState<getUser[]>([]);
  const [admins, setAdmins] = useState<getUser[]>([]);
  const [selectedTab, setSelectedTab] = useState<AdminDashboardTabs>(AdminDashboardTabs.USERS);
  const [serviceType, setServiceType] = useState<AdminDashboardServices>(AdminDashboardServices.PLACES);
  const [serviceMode, setServiceMode] = useState<AdminDashboardServiceMode>(AdminDashboardServiceMode.VIEW);
  const [serviceData, setServiceData] = useState<adminDashboardServiceType[]>([]);
  const [form, setForm] = useState<adminDashboardFormType>({} as adminDashboardFormType);
  const [stats, setStats] = useState({ total_user: 0, explorer: 0, traveller: 0, admin: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    const data = await getAllUsers();
    const nonAdmins = data.filter(d => d.role !== 'admin'); 
    setUsers(nonAdmins);
    const adminUsers = data.filter(d => d.role === 'admin');
    setAdmins(adminUsers);
    const roleCount = { total_user: data.length, explorer: 0, traveller: 0, admin: 0 };
    data.forEach((u) => roleCount[u.role  as keyof typeof roleCount]++);
    setStats(roleCount);
  };

  const handleUpdateRole = async (id: string) => {
    await updateUser(id, { role: "admin" });
    fetchUsers();
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handleServiceFetch = async () => {
    let data: any[] = [];
    if (serviceType === AdminDashboardServices.PLACES) data = await getPlaces();
    if (serviceType === AdminDashboardServices.ACCOMMODATIONS) data = await getAccommodations();
    if (serviceType === AdminDashboardServices.TRANSPORTS) data = await getTransports();
    if (serviceType === AdminDashboardServices.RESTAURANTS) data = await getRestaurants();
    setServiceData(data);
  };

  useEffect(() => {
    if (selectedTab === AdminDashboardTabs.SERVICES && serviceMode === AdminDashboardServiceMode.VIEW) {
      handleServiceFetch();
    }
  }, [serviceType, selectedTab, serviceMode]);

  const handleSubmitService = async () => {
    try {
      const normalizedForm = { ...form };
      ["latitude", "longitude", "cost_per_person"].forEach((field) => {
        if (field in normalizedForm && (normalizedForm as any)[field] !== "") 
        {
          (normalizedForm as any)[field] = parseFloat(String((normalizedForm as any)[field]));
        }
      });

      if (serviceType === AdminDashboardServices.PLACES) 
      {
        if (serviceMode === AdminDashboardServiceMode.ADD) 
        {
          await createPlace(normalizedForm as placeCreation);
        } 
        else 
        {
          await updatePlace(normalizedForm as placeUpdation);
        }
      } 
      else if (serviceType === AdminDashboardServices.ACCOMMODATIONS) 
      {
        if (serviceMode === AdminDashboardServiceMode.ADD) 
        {
          await createAccommodation(normalizedForm as accommodationCreation);
        } 
        else 
        {
          await updateAccommodation(normalizedForm as accommodationUpdation);
        }
      } 
      else if (serviceType === AdminDashboardServices.TRANSPORTS) 
      {
        if (serviceMode === AdminDashboardServiceMode.ADD) 
        {
          await createTransport(normalizedForm as transportCreation);
        } 
        else 
        {
          await updateTransport(normalizedForm as transportUpdation);
        }
      } 
      else if (serviceType === AdminDashboardServices.RESTAURANTS) 
      {
        if (serviceMode === AdminDashboardServiceMode.ADD) 
        {
          await createRestaurant(normalizedForm as restaurantCreation);
        } 
        else {
          await updateRestaurant(normalizedForm as restaurantUpdation);
        }
      }

      setForm({} as adminDashboardFormType);
      handleServiceFetch();
    } 
    catch (err) 
    {
      logger.error("Error submitting service form", err);
    }
  };


  const renderStats = () => (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {Object.entries(stats).map(([key, val]) => (
        <div
          key={key}
          className="bg-blue-100 p-4 rounded shadow text-center text-blue-900 font-semibold"
        >
          {key.toUpperCase()+'S'}: {val}
        </div>
      ))}
    </div>
  );

  const renderUsers = () => (
    <div className="grid gap-4 mt-6">
      {users.map((user) => (
        <div key={user.user_id} className=" bg-sky-100 border border-sky-400 shadow-md  p-4 rounded">
          <p><b>Username:</b> {user.username}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Phone:</b> {user.phone_no}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Joined:</b> {formatDateString(user.created_at!)}</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => handleUpdateRole(user.username)} className="bg-green-500 text-white px-3 py-1 rounded">Make Admin</button>
            <button onClick={() => handleDeleteUser(user.username)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );


  const renderAdmins = () => (
    <div className="grid gap-4 mt-6">
      {admins.map((user) => (
        <div key={user.user_id} className=" bg-sky-100 border border-sky-400 shadow-md p-4 rounded">
          <p><b>Username:</b> {user.username}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Phone:</b> {user.phone_no}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Joined:</b> {formatDateString(user.created_at!)}</p>
         
        </div>
      ))}
    </div>
  );


  const renderServiceView = () => (
    <div className="grid gap-6 mt-4">
    {serviceData.map((item, idx) => (
      <div key={idx} className="bg-sky-100 shadow border border-sky-400 p-4 rounded">
        {Object.entries(item).map(([k, v]) => {
          if (k.endsWith("_id")) return null;
          if (k === "location" && typeof v === "object" && v !== null) {
            return (
              <div key={k}>
                <p><b>Location Latitude:</b> {String(v.latitude)}</p>
                <p><b>Location Longitude:</b> {String(v.longitude)}</p>
              </div>
            );
          }
          return (
            <p key={k}>
              <b>{k}:</b> {String(v)}
            </p>
            );
          })}
        </div>
      ))}
    </div>
    );

  const renderServiceForm = () => {
  const fieldsMap: Record<typeof serviceType, string[]> = {
    places: ["place_id", "place_name", "latitude", "longitude"],
    accommodations: ["accommodation_id", "accommodation_type", "accommodation_name", "latitude", "longitude"],
    transports: ["transport_id", "transport_type", "transport_name", "cost_per_person"],
    restaurants: ["restaurant_id", "restaurant_name", "latitude", "longitude"],
  };

  const isEdit = serviceMode === AdminDashboardServiceMode.EDIT;
  const rawFields = fieldsMap[serviceType];

  const fields = isEdit
    ? rawFields
    : rawFields.filter((field) => !field.endsWith("_id"));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmitService();
      }}
      className="space-y-3 mt-4"
    >
      {fields.map((field) => (
        <input
          key={field}
          placeholder={field}
          value={form[field as keyof typeof form] || ""}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      ))}
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        {isEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};


  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {renderStats()}

      <div className="flex gap-4 my-6">
        <button
          onClick={() => setSelectedTab("users")}
          className={`px-4 py-2 rounded ${selectedTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          View Users
        </button>

        <button
          onClick={() => setSelectedTab("admins")}
          className={`px-4 py-2 rounded ${selectedTab === "admins" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          View Admins
        </button>

        <button
          onClick={() => setSelectedTab("services")}
          className={`px-4 py-2 rounded ${selectedTab === "services" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Services
        </button>
      </div>

      {selectedTab === AdminDashboardTabs.USERS && renderUsers()}

      {selectedTab === AdminDashboardTabs.ADMINS && renderAdmins()}

      {selectedTab === AdminDashboardTabs.SERVICES && (
        <>
          <div className="flex gap-3 mb-4">
            {["places", "accommodations", "transports", "restaurants"].map((s) => (
              <button
                key={s}
                onClick={() => setServiceType(s as typeof serviceType)}
                className={`px-3 py-1 rounded ${serviceType === s ? "bg-blue-500 text-white" : "bg-gray-300"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {["view", "add", "edit"].map((m) => (
              <button
                key={m}
                onClick={() => setServiceMode(m as typeof serviceMode)}
                className={`px-3 py-1 rounded ${serviceMode === m ? "bg-green-500 text-white" : "bg-gray-300"}`}
              >
                {m}
              </button>
            ))}
          </div>

          {serviceMode === AdminDashboardServiceMode.VIEW && renderServiceView()}
          {(serviceMode === AdminDashboardServiceMode.ADD || serviceMode === AdminDashboardServiceMode.EDIT) && renderServiceForm()}
        </>
      )}
    </div>
  );
}
