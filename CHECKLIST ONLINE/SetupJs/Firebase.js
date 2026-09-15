// Configuración de Conexión a Firebase Firestore
const firebaseConfig = {
  apiKey: "AIzaSyBu54-gCkbroy2rzYyWm-wR8kZzDM_H9vk",
  authDomain: "gestion-maquinaria-pwa.firebaseapp.com",
  projectId: "gestion-maquinaria-pwa",
  storageBucket: "gestion-maquinaria-pwa.firebasestorage.app",
  messagingSenderId: "809833022067",
  appId: "1:809833022067:web:447d9e1c8f2957faac6006"
};

let db = null;

try {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "AIzaSy...") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    db.enablePersistence().catch(() => console.log("Persistencia offline activa"));
  }
} catch (e) {
  console.warn("Modo offline local activo");
}