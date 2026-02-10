import { getMessaging, getToken } from "@/firebase/firebase/messaging";
import {  messaging } from "../firebase/firebase";


export async function getFcmToken(): Promise<string | null> {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BMHm4OikYaAyEjLoKZIO8FFIrnKYVin9P58MInDZSYJ8N0YKBZRwNLuCOWLZuO77AZHWk42AF9l5p2oi__x1v84"
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
