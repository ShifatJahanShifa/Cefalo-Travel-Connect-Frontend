import { ProximityContext } from "../contexts/proximityContext";
import { useContext } from "react";

export const useProximity = () => {
  const context = useContext(ProximityContext);
  if (!context) {
    throw new Error("useProximity must be used within ProximityProvider");
  }
  return context;
};
