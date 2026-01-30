/**
 * مدیریت نوتیفیکیشن‌های روزانه
 */

class NotificationManager {
    constructor() {
        this.reminderTime = '20:00'; // پیش‌فرش ساعت ۸ شب
        this.notificationPermission = null;
        this.loadSettings();
        this.init();
    }

    // بارگذاری تنظیمات از localStorage
    loadSettings() {
        const saved = localStorage.getItem('roseReminderSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.reminderTime = settings.reminderTime || '20:00';
        }
    }

    // ذخیره تنظیمات
    saveSettings() {
        const settings = {
            reminderTime: this.reminderTime,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('roseReminderSettings', JSON.stringify(settings));
    }

    // مقداردهی اولیه
    async init() {
        // درخواست مجوز نوتیفیکیشن
        if ('Notification' in window) {
            this.notificationPermission = Notification.permission;
            
            if (this.notificationPermission === 'default') {
                this.notificationPermission = await Notification.requestPermission();
            }
        }

        // تنظیم تایمر روزانه
        this.setDailyReminder();
        
        // چک کردن نوتیفیکیشن هر دقیقه
        setInterval(() => this.checkReminderTime(), 60000);
    }

    // تنظیم نوتیفیکیشن روزانه
    setDailyReminder() {
        // پاک کردن reminder قبلی
        if (this.reminderTimeout) {
            clearTimeout(this.reminderTimeout);
        }

        const now = new Date();
        const [hours, minutes] = this.reminderTime.split(':').map(Number);
        
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);
        
        // اگر زمان از حالا گذشته، برای فردا تنظیم کن
        if (reminderTime < now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const timeUntilReminder = reminderTime - now;
        
        this.reminderTimeout = setTimeout(() => {
            this.sendDailyReminder();
            this.setDailyReminder(); // برای فردا هم تنظیم کن
        }, timeUntilReminder);

        console.log(`یادآوری بعدی: ${reminderTime.toLocaleTimeString('fa-IR')}`);
    }

    // چک کردن زمان یادآوری
    checkReminderTime() {
        const now = new Date();
        const [hours, minutes] = this.reminderTime.split(':').map(Number);
        
        if (now.getHours() === hours && now.getMinutes() === minutes) {
            this.sendDailyReminder();
        }
    }

    // ارسال نوتیفیکیشن روزانه
    sendDailyReminder() {
        if (this.notificationPermission !== 'granted') return;

        const title = '🌸 وقت سر زدن به رز عشقه!';
        const body = 'یادت نره امروز به رزت سر بزنی، وگرنه شروع به پژمرده شدن می‌کنه!';
        const icon = 'https://cdn-icons-png.flaticon.com/512/1998/1998678.png';

        // نوتیفیکیشن مرورگر
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: icon,
                tag: 'daily-rose-reminder',
                requireInteraction: true
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }

        // اگر مرورگر از service worker پشتیبانی می‌کند
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body: body,
                    icon: icon,
                    tag: 'daily-rose-reminder',
                    requireInteraction: true,
                    vibrate: [200, 100, 200]
                });
            });
        }

        // پخش صدای نوتیفیکیشن
        this.playNotificationSound();

        console.log('یادآوری روزانه ارسال شد');
    }

    // پخش صدای نوتیفیکیشن
    playNotificationSound() {
        const audio = new Audio('sounds/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('خطا در پخش صدا:', e));
    }

    // تست نوتیفیکیشن
    testNotification() {
        this.sendDailyReminder();
        
        // نمایش پیام تست
        if ('Toast' in window) {
            window.showToast('نوتیفیکیشن تست ارسال شد!', 'success');
        } else {
            alert('نوتیفیکیشن تست ارسال شد!');
        }
    }

    // تغییر زمان یادآوری
    setReminderTime(time) {
        this.reminderTime = time;
        this.saveSettings();
        this.setDailyReminder();
        
        return `یادآوری برای ساعت ${time} تنظیم شد`;
    }

    // گرفتن وضعیت نوتیفیکیشن
    getStatus() {
        return {
            permission: this.notificationPermission,
            reminderTime: this.reminderTime,
            nextReminder: this.getNextReminderTime()
        };
    }

    // گرفتن زمان یادآوری بعدی
    getNextReminderTime() {
        const now = new Date();
        const [hours, minutes] = this.reminderTime.split(':').map(Number);
        
        const nextTime = new Date();
        nextTime.setHours(hours, minutes, 0, 0);
        
        if (nextTime < now) {
            nextTime.setDate(nextTime.getDate() + 1);
        }
        
        return nextTime;
    }
}

// ایجاد نمونه global
const notificationManager = new NotificationManager();
