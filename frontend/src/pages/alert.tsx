import { useEffect, useState, useRef } from "react";
import { checkProximities, getProximityByUsername } from "../services/proximityService";
import type { proximity } from "../types/proximity";
import { toast } from "react-toastify";
import type { alertItem } from "../types/alert";
import { useProximity } from "../hooks/useProximity";
import { useAuth } from "../hooks/useAuth";
import { logger } from "../utils/logger";

export default function AlertWindow() {
  const [alerts, setAlerts] = useState<alertItem[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const shownAlerts = useRef<Set<string>>(new Set());

  const { username } = useAuth()
  const { setProximityEnabled } = useProximity()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => logger.error("Failed to get location", err),
      { enableHighAccuracy: true }
    );
  }, []);


  useEffect(() => {
    if (latitude && longitude) {
      const interval = setInterval(async () => {
        const data = {
          userLat: latitude,
          userLong: longitude,
        };

        try {
          const response: alertItem[] = await checkProximities(data);
          const proximities: proximity[] = await getProximityByUsername(username!)
          if (response && response.length > 0) {
            setAlerts(response);

            response.forEach((alert) => {
              
              const alertKey = `${alert.wishlist_id}-${alert.place}`;
              if (!shownAlerts.current.has(alertKey)) {
                shownAlerts.current.add(alertKey);

                const audio = new Audio("/sounds/notification-1.mp3");
                audio.play().catch((e) => {
                  logger.warn("Autoplay blocked or error playing sound:", e);
                });
                
                toast(
                  <div> 
                    🔔 <strong>
                      You are {(alert.distance).toFixed(2)} km away from your wishlisted place {alert.place} 
                      from wishlist.<br />
                      Title: {alert.title}
                    </strong>
                  </div>,
                  {
                    type: "info",
                    autoClose: 5000,
                    pauseOnHover: true,
                  }
                );
              }
            });
          }
          else if(proximities.length === 0) 
          {
            setProximityEnabled(false);
          }
        } catch (err) {
          logger.error("Failed to fetch alerts", err);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [latitude, longitude]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
     
    </div>
  );
}
