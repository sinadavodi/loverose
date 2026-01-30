self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  self.clients.claim();
});

// نوتیفیکیشن روزانه
self.addEventListener("push", function (e) {
  e.waitUntil(
    self.registration.showNotification("🌹 RoseLove", {
      body: "من اینجام… فقط خواستم یادت بندازم 😌",
      icon: "https://cdn-icons-png.flaticon.com/512/833/833472.png"
    })
  );
});
