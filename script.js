// درخواست اجازه نوتیفیکیشن
if ("Notification" in window) {
  Notification.requestPermission();
}

// نوتیفیکیشن ساده (وقتی صفحه بازه)
setTimeout(() => {
  if (Notification.permission === "granted") {
    new Notification("🌹 RoseLove", {
      body: "اگه نیای، من دلتنگ میشم…"
    });
  }
}, 3000);
