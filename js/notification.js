/**
 * مدیریت نوتیفیکیشن‌های روزانه - نسخه ساده
 */

class NotificationManager {
    constructor() {
        this.reminderTime = '20:00';
        this.loadSettings();
        this.init();
    }

    // بارگذاری تنظیمات
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
        // تنظیم تایمر روزانه
        this.setDailyReminder();
        
        // چک کردن نوتیفیکیشن هر دقیقه
        setInterval(() => this.checkReminderTime(), 60000);
        
        console.log('مدیریت نوتیفیکیشن راه‌اندازی شد');
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
        return `یادآوری برای ${reminderTime.toLocaleTimeString('fa-IR')} تنظیم شد`;
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
        // فقط اگر مرورگر از Notification پشتیبانی می‌کند
        if (!('Notification' in window)) {
            console.log('مرورگر از Notification پشتیبانی نمی‌کند');
            return;
        }

        // درخواست مجوز اگر لازم است
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification();
                }
            });
        } else if (Notification.permission === 'granted') {
            this.showNotification();
        }
    }

   
