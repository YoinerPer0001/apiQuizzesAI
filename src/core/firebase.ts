import admin from "firebase-admin";
import serviceAccount from "../../google-services.json" with { type: "json" };

if (!admin.apps.length) { // ✅ evita inicializar más de una vez
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;