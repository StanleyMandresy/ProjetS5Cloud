import React, { createContext, useContext, useEffect, useState } from "react";
import { travauxService } from "../services/travaux.service";
import type { Travail } from "../services/travaux.service";

interface TravauxContextType {
  travaux: Travail[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const TravauxContext = createContext<TravauxContextType | undefined>(undefined);

export const TravauxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [travaux, setTravaux] = useState<Travail[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTravaux = async () => {
    try {
      setLoading(true);
      const data = await travauxService.getAll();
      setTravaux(data);
    } catch (error) {
      console.error("Erreur chargement travaux :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTravaux();
  }, []);

  return (
    <TravauxContext.Provider
      value={{
        travaux,
        loading,
        refresh: loadTravaux,
      }}
    >
      {children}
    </TravauxContext.Provider>
  );
};

// Hook custom
export const useTravaux = () => {
  const context = useContext(TravauxContext);
  if (!context) {
    throw new Error("useTravaux must be used inside TravauxProvider");
  }
  return context;
};
