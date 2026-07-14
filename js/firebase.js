let firebaseServicesPromise;

async function loadSdk() {
  const version = "12.16.0";

  const [
    appModule,
    authModule,
    firestoreModule,
    storageModule,
  ] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${version}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${version}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${version}/firebase-firestore.js`),
    import(`https://www.gstatic.com/firebasejs/${version}/firebase-storage.js`),
  ]);

  return {
    ...appModule,
    ...authModule,
    ...firestoreModule,
    ...storageModule,
  };
}

export async function getFirebaseServices() {
  if (!firebaseServicesPromise) {
    firebaseServicesPromise = (async () => {
      const response = await fetch("/api/firebase-config", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Không tải được cấu hình Firebase.");
      }

      const payload = await response.json();
      const firebaseConfig = payload.firebaseConfig || {};

      if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        throw new Error("Firebase config chưa được cấu hình đầy đủ.");
      }

      const sdk = await loadSdk();
      const app = sdk.getApps().length ? sdk.getApp() : sdk.initializeApp(firebaseConfig);

      return {
        app,
        adminEmail: payload.adminEmail || "",
        firebaseConfig,
        ...sdk,
      };
    })();
  }

  return firebaseServicesPromise;
}
