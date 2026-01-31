// notification.js

function initNotifications() {
  if (!("Notification" in window)) {
    console.log("🔕 Notification پشتیبانی نمی‌شود");
    return;
  }

  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("🔔 مدیریت نوتیفیکیشن راه‌اندازی شد");
      scheduleDailyReminder();
    }
  });
}

function scheduleDailyReminder() {
  const now = new Date();
  const target = new Date();

  target.setHours(20, 0, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  console.log(
    "⏰ یادآوری بعدی:",
    target.toLocaleTimeString("fa-IR")
  );

  setTimeout(() => {
    showNotification();
  }, delay);
}

function showNotification() {
  new Notification("🌹 LoveRose", {
    body: "یه گل رز منتظرته…",
    icon: "./favicon.ico"
  });
}

initNotifications();
