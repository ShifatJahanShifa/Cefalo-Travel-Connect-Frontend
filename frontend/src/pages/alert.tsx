import { useEffect, useState } from "react";
import { checkProximities } from "../services/proximityService";

export default function AlertWindow() {
  const [alerts, setAlerts] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => console.error("Failed to get location", err),
      { enableHighAccuracy: true }
    );
  }, []);


  useEffect(() => {
    if (latitude && longitude) {
      const interval = setInterval(async () => {
        const data = {
            userLat: latitude,
            userLong: longitude
        }
        try {
          const response = await checkProximities(data);
          if (response && response.length > 0) {
            setAlerts(response); 
          }
        } catch (err) {
          console.error("Failed to fetch alerts", err);
        }
      }, 2000); 

      return () => clearInterval(interval); 
    }
  }, [latitude, longitude]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow"
        >
          🔔 {alert}
        </div>
      ))}
    </div>
  );
}
