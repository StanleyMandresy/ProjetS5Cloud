
import {  messaging } from "../firebase/firebase";
import { getToken } from "firebase/messaging";


export async function getFcmToken(): Promise<string | null> {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BK7JgoDObYa6v4nX70gZ4s5_L5dEo4LWlpDyFJ5lqtpZ34dYIfjNHFWZ_WvOxu20B6R2Vrvq91uYHNGc3AmAclY"
    });

    if (token) {
      console.log("✅ FCM token:", token);
      return token;
    }

    console.warn("⚠️ Aucun token FCM");
    return null;
  } catch (err) {
    console.error("❌ Erreur FCM token", err);
    return null;
  }
}
