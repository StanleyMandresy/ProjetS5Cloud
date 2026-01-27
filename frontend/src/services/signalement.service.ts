import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type Signalement = {
  id: string;
  titre: string;
  description: string;
  latitude: number;
  longitude: number;
  statut: string;
};

export const signalementService = {
  async getAll(): Promise<Signalement[]> {
    const q = query(
      collection(db, "signalements"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Signalement, "id">),
    }));
  },
};
