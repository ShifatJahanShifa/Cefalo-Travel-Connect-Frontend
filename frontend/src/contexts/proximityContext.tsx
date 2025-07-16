import { createContext, useState } from "react";

type ProximityContextType = {
  proximityEnabled: boolean;
  setProximityEnabled: (enabled: boolean) => void;
};

export const ProximityContext = createContext<ProximityContextType | null>(null);

export const ProximityProvider = ({ children }: { children: React.ReactNode }) => {
  const [proximityEnabled, setProximityEnabled] = useState(false);

  return (
    <ProximityContext.Provider value={{ proximityEnabled, setProximityEnabled }}>
      {children}
    </ProximityContext.Provider>
  );
};

