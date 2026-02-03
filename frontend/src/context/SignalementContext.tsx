import { createContext, useContext, useState } from "react";
import { signalementService,type Signalement } from "../services/signalement.service";


type SignalementContextType = {
  signalements: Signalement[];
  loading: boolean;
  syncSignalements: () => Promise<void>;
};

const SignalementContext = createContext<SignalementContextType | null>(null);

export const SignalementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(false);

  const syncSignalements = async () => {
    setLoading(true);
    try {
      const data = await signalementService.getAll();
      setSignalements(data);
    } catch (err) {
      console.error("Erreur lors de la synchronisation des signalements:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignalementContext.Provider value={{ signalements, loading, syncSignalements }}>
      {children}
    </SignalementContext.Provider>
  );
};

export const useSignalements = () => {
  const ctx = useContext(SignalementContext);
  if (!ctx) throw new Error("useSignalements must be used inside SignalementProvider");
  return ctx;
};
